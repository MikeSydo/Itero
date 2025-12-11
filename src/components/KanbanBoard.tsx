import type { kanbanBoard as KanbanBoardType, TasksList as TasksListType, Task } from "types/index";
import { useFetch, useEditableName } from "../hooks";
import { TasksList, TaskCard } from "./";
import { Flex, Button, Input, Space, MenuProps, Dropdown } from 'antd'
import { useState, useEffect, useRef, useMemo } from "react";
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragOverEvent, DragStartEvent, closestCenter, UniqueIdentifier, DragOverlay, pointerWithin, rectIntersection, getFirstCollision } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useModel, useNavigate, useIntl } from "@umijs/max";
import { ProLayout } from '@ant-design/pro-layout';
import { DeleteOutlined, StarOutlined, StarFilled } from "@ant-design/icons";
import { createPortal } from 'react-dom';

export default function KanbanBoard({ id, onDelete }: { id: number, onDelete?: (id: number) => void }) {
  const { data:board, loading:loadingBoard, error:errorBoard } = useFetch<KanbanBoardType>(`/boards/${id}`);
  const { data:lists, loading:loadingLists, error:errorLists } = useFetch<TasksListType[]>(`/boards/${id}/lists`);
  const [isCreating, setIsCreating] = useState(false);
  const [listName, setListName] = useState('');
  const [creating, setCreating] = useState(false);
  const [displayLists, setDisplayLists] = useState<TasksListType[]>([]);
  const [allTasks, setAllTasks] = useState<Record<number, Task[]>>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const { initialState } = useModel('@@initialState');

  const loading = loadingBoard || loadingLists;
  const error = errorBoard || errorLists;
  const api =  `http://localhost:${process.env.PORT || 3000}`;
  const isDarkTheme = initialState?.settings?.navTheme === 'realDark';
  const navigate = useNavigate();

  const boardNameEditor = useEditableName({
      initialName: board?.name || '',
      onUpdate: async (newName) => {
          const response = await fetch(`${api}/boards/${id}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: newName }),
          });
          if (!response.ok) throw new Error('Failed to update board name');
      },
  });

  useEffect(() => {
      if (lists) {
          setDisplayLists(lists);
      }
  }, [lists]);

  useEffect(() => {
      if (board) {
          setIsFavorite(board.isFavorite || false);
      }
  }, [board]);

  useEffect(() => {
  const handleTaskUpdate = (event: any) => {
    const { taskId, listId } = event.detail;
    if (listId) {
      fetch(`${api}/lists/${listId}/tasks`)
        .then(res => res.json())
        .then(tasks => {
          setAllTasks(prev => ({ ...prev, [listId]: tasks }));
        })
        .catch(err => console.error('Failed to refresh tasks:', err));
    }
  };

  window.addEventListener('taskUpdated', handleTaskUpdate);
  return () => window.removeEventListener('taskUpdated', handleTaskUpdate);
}, [api]);

  const handleCreateList = async () => {
  if (!listName.trim()) {
    return;
  }

  setCreating(true);
    try {
      const response = await fetch(`${api}/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: listName,
          boardId: id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create list');

      const newList = await response.json();
      setDisplayLists([...displayLists, newList]);
      setListName('');
      setIsCreating(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    setListName('');
    setIsCreating(false);
  };

  const handleCreateListKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleCreateList();
    } else if (e.key === 'Escape') {  
      handleCancel();
    }
  };

  const findTaskList = (taskId: UniqueIdentifier): number | null => {
    for (const [listId, tasks] of Object.entries(allTasks)) {
      if (tasks.some(task => task.id === taskId)) {
        return parseInt(listId);
      }
    }
    return null;
  }

  // Check if the id belongs to a list
  const isListId = (id: UniqueIdentifier): boolean => {
    return displayLists.some(list => list.id === id);
  };

  // Get active item (list or task)
  const activeList = activeId && isListId(activeId) 
    ? displayLists.find(list => list.id === activeId) 
    : null;
  
  const activeTask = activeId && !isListId(activeId)
    ? Object.values(allTasks).flat().find(task => task.id === activeId)
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeIdNum = active.id as number;
    const overIdNum = over.id as number;
    
    // If dragging a list
    if (isListId(activeIdNum)) {
      return; // List reordering is handled in onDragEnd
    }
    
    // Dragging a task
    const activeListId = findTaskList(activeIdNum);
    let overListId: number | null = null;
    
    if (isListId(overIdNum)) {
      overListId = overIdNum;
    } else {
      overListId = findTaskList(overIdNum);
    }
    
    if (!activeListId || !overListId) return;
    
    // Same container - let sortable handle it
    if (activeListId === overListId) {
      setAllTasks(prev => {
        const tasks = prev[activeListId] || [];
        const activeIndex = tasks.findIndex(t => t.id === activeIdNum);
        const overIndex = tasks.findIndex(t => t.id === overIdNum);
        
        if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
          return prev;
        }
        
        return {
          ...prev,
          [activeListId]: arrayMove(tasks, activeIndex, overIndex)
        };
      });
      return;
    }
    
    // Moving between containers
    setAllTasks(prev => {
      const sourceTasks = [...(prev[activeListId] || [])];
      const destTasks = [...(prev[overListId] || [])];
      
      const activeIndex = sourceTasks.findIndex(t => t.id === activeIdNum);
      if (activeIndex === -1) return prev;
      
      const [movedTask] = sourceTasks.splice(activeIndex, 1);
      
      let newIndex: number;
      if (isListId(overIdNum)) {
        // Dropping on list itself - add at end
        newIndex = destTasks.length;
      } else {
        // Dropping on a task
        const overIndex = destTasks.findIndex(t => t.id === overIdNum);
        newIndex = overIndex >= 0 ? overIndex : destTasks.length;
      }
      
      destTasks.splice(newIndex, 0, movedTask);
      recentlyMovedToNewContainer.current = true;
      
      return {
        ...prev,
        [activeListId]: sourceTasks,
        [overListId]: destTasks
      };
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!over) return;
    
    const activeIdNum = active.id as number;
    const overIdNum = over.id as number;
    
    // If dragging a list
    if (isListId(activeIdNum)) {
      const activeIndex = displayLists.findIndex(list => list.id === activeIdNum);
      let overIndex = displayLists.findIndex(list => list.id === overIdNum);
      
      // If dropping on a task, find its parent list
      if (overIndex === -1) {
        const taskListId = findTaskList(overIdNum);
        if (taskListId) {
          overIndex = displayLists.findIndex(list => list.id === taskListId);
        }
      }
      
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const newLists = arrayMove(displayLists, activeIndex, overIndex);
        setDisplayLists(newLists);
        
        try {
          await Promise.all(
            newLists.map((list, index) =>
              fetch(`${api}/lists/${list.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ position: index }),
              })
            )
          );
        } catch (err) {
          console.error('Failed to update list positions:', err);
        }
      }
      return;
    }
    
    // Dragging a task - persist changes
    const currentListId = findTaskList(activeIdNum);
    if (!currentListId) return;
    
    const tasksInList = allTasks[currentListId] || [];
    
    try {
      await Promise.all(
        tasksInList.map((task, index) =>
          fetch(`${api}/tasks/${task.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              listId: currentListId,
              position: index
            }),
          })
        )
      );
    } catch (err) {
      console.error('Failed to update task positions:', err);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
    useSensor(TouchSensor),
  );

   const handleDelete = async () => {
    try {
      const response = await fetch(`${api}/boards/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete board');
      
      if (onDelete) {
        onDelete(id);
      }
      
      navigate('/boards');
    } catch (err) {
      console.error('Error deleting board:', err);
    }
  };

  const handleToggleFavorite = async () => {
    const newFavoriteState = !isFavorite;
    
    try {
      const response = await fetch(`${api}/boards/${id}/favorite`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFavorite: newFavoriteState }),
      });

      if (!response.ok) throw new Error('Failed to update favorite status');
      
      setIsFavorite(newFavoriteState);
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  const intl = useIntl();

  const menuItems: MenuProps['items'] = [
    {
      key: 'favorite',
      label: isFavorite 
        ? intl.formatMessage({ id: 'pages.board.favorite.remove' })
        : intl.formatMessage({ id: 'pages.board.favorite.add' }),
      icon: isFavorite ? <StarFilled /> : <StarOutlined />,
      onClick: handleToggleFavorite,
    },
    {
      key: 'delete',
      label: intl.formatMessage({ id: 'pages.common.delete' }),
      icon: <DeleteOutlined/>,
      danger: true,
      onClick: handleDelete,
    },
  ];

  return (
    <>
      <ProLayout
        logo="/itero-logo.png"
        title = "Itero"
        layout="top"
        navTheme={isDarkTheme ? 'realDark' : 'light'}
        fixedHeader
        menuRender={false}
        footerRender={false}
        contentStyle={{ padding: 0, margin: 0 }}
        style={{ '--ant-pro-layout-header-border': 'none'} as any}
        headerContentRender={() => (
          <Flex justify="space-between" align="center" style={{ width: '100%', WebkitAppRegion: 'drag' } as React.CSSProperties}>
            <Button 
              type="text" 
              onClick={() => navigate('/boards')}
              style={{ color: isDarkTheme ? 'white' : '#000', fontSize: 16, WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            >
              Boards
            </Button>
            {window.electronAPI && (
              <div style={{ display: 'flex', gap: 0, WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
                <Button
                  type="text"
                  onClick={() => window.electronAPI?.minimizeWindow()}
                  style={{ 
                    color: isDarkTheme ? 'white' : '#000', 
                    fontSize: 16,
                    width: 46,
                    height: 46,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 4,
                    WebkitAppRegion: 'no-drag'
                  } as React.CSSProperties}
                >
                  −
                </Button>
                <Button
                  type="text"
                  onClick={() => window.electronAPI?.maximizeWindow()}
                  style={{ 
                    color: isDarkTheme ? 'white' : '#000', 
                    fontSize: 16,
                    width: 46,
                    height: 46,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    WebkitAppRegion: 'no-drag'
                  } as React.CSSProperties}
                >
                  □
                </Button>
                <Button
                  type="text"
                  onClick={() => window.electronAPI?.closeWindow()}
                  style={{ 
                    color: isDarkTheme ? 'white' : '#000', 
                    fontSize: 16,
                    width: 46,
                    height: 46,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    WebkitAppRegion: 'no-drag'
                  } as React.CSSProperties}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e81123'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  ✕
                </Button>
              </div>
            )}
          </Flex>
        )}>
        <div style={{ background: isDarkTheme ? '#1a1a1a' : '#f5f5f5', minHeight: 'calc(100vh - 64px)', border: 'none', display: 'flex', flexDirection: 'column' }}>
          <Flex justify="space-between" align="center" style={{ padding: '16px 24px', background: isDarkTheme ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)', 
            backdropFilter: 'blur(10px)', flexShrink: 0, position: 'sticky', top: 0, zIndex: 10 }}>
            {boardNameEditor.isEditing ? (
              <Input
                value={boardNameEditor.name}
                onChange={(e) => boardNameEditor.setName(e.target.value)}
                onKeyDown={boardNameEditor.handleKeyPress}
                onBlur={boardNameEditor.cancelEdit}
                autoFocus
                style={{ margin: 0, fontSize: 30, width: 'auto', minWidth: 200, maxWidth: 500, height: 48, padding: '4px 11px', backgroundColor: isDarkTheme ? '#1f1f1f' : '#fff', color: isDarkTheme ? '#fff' : '#000', borderColor: isDarkTheme ? '#434343' : '#d9d9d9' }}
              />
            ) : (
              <Button
                style={{ fontSize: 30, margin: 0, background: 'transparent', border: 'none', color: isDarkTheme ? 'white' : '#000', minWidth: 50, height: 48, padding: '4px 11px'}}
                onClick={boardNameEditor.startEditing}
              >
                {boardNameEditor.name}
              </Button>
            )}
            <Space>
              <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <Button>...</Button>
              </Dropdown>  
            </Space>
          </Flex>
          <div style={{ overflowX: 'auto', overflowY: 'hidden', flex: 1 }}>
            <Flex style={{ padding: 20, paddingTop: 40, height: '100%', minWidth: 'fit-content' }} gap={20} align="start">
            {error && <div style={{ color: 'salmon' }}>{error}</div>}
            {loading && <div style={{ color: isDarkTheme ? '#fff' : '#000' }}>Loading…</div>}
            <DndContext 
              sensors={sensors} 
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragCancel={handleDragCancel}
              collisionDetection={closestCenter}
            >
              <SortableContext items={displayLists.map(l => l.id)} strategy={horizontalListSortingStrategy}>
                {!loading && !error && displayLists && displayLists.map(list => (
                  <TasksList 
                    key={list.id} 
                    list={list}
                    tasks={allTasks[list.id] || []}
                    setTasks={(tasks) => setAllTasks(prev => ({ ...prev, [list.id]: tasks }))}
                  />
                ))}
              </SortableContext>
              {createPortal(
                <DragOverlay>
                  {activeList ? (
                    <div style={{ 
                      background: '#3d3d3d', 
                      width: 300, 
                      borderRadius: 8, 
                      padding: 10,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      opacity: 0.9,
                      rotate: '3deg'
                    }}>
                      <div style={{ fontSize: 20, fontWeight: 600, color: 'white', padding: '0 5px' }}>
                        {activeList.name}
                      </div>
                      <div style={{ minHeight: 50, marginTop: 10 }}>
                        {(allTasks[activeList.id] || []).slice(0, 3).map(task => (
                          <div key={task.id} style={{ 
                            background: '#2d2d2d', 
                            padding: 10, 
                            borderRadius: 6, 
                            marginBottom: 5,
                            color: 'white'
                          }}>
                            {task.name}
                          </div>
                        ))}
                        {(allTasks[activeList.id] || []).length > 3 && (
                          <div style={{ color: '#888', fontSize: 12, padding: 5 }}>
                            +{(allTasks[activeList.id] || []).length - 3} more tasks
                          </div>
                        )}
                      </div>
                    </div>
                  ) : activeTask ? (
                    <div style={{ 
                      background: '#2d2d2d', 
                      padding: 10, 
                      borderRadius: 6,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                      color: 'white',
                      width: 280,
                      opacity: 0.9
                    }}>
                      {activeTask.name}
                    </div>
                  ) : null}
                </DragOverlay>,
                document.body
              )}
            </DndContext>
            {isCreating ? (
                    <div style={{ marginLeft: 20, marginBottom: 5, width: 300, minWidth: 300, flexShrink: 0 }}>
                    <Input
                        placeholder="Enter list name..."
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        onKeyDown={handleCreateListKeyPress}
                        autoFocus
                        style={{ marginBottom: 10 }}
                    />
                    <Space>
                        <Button 
                        type="primary"
                        onClick={handleCreateList}
                        loading={creating}
                        >
                        Add List
                        </Button>
                        <Button onClick={handleCancel}>
                        X
                        </Button>
                    </Space>
                    </div>
                ) : (
                    <Button 
                      style = {{height: 60, fontSize: 25, opacity: 0.7, background: isDarkTheme ? '#2a2a2a' : '#e0e0e0', borderColor: isDarkTheme ? '#3d3d3d' : '#ccc', color: isDarkTheme ? 'white' : '#000', marginLeft:20, marginBottom:5, padding:10, width: 300, minWidth: 300, flexShrink: 0, display: 'flex', justifyContent: 'flex-start'}}
                      onMouseEnter={(e) => e.currentTarget.style.background = isDarkTheme ? '#3d3d3d' : '#d0d0d0'}
                      onMouseLeave={(e) => e.currentTarget.style.background = isDarkTheme ? '#2a2a2a' : '#e0e0e0'}
                      onClick={() => setIsCreating(true)}
                    >
                    + New List
                    </Button>
                )
            }
            </Flex>
          </div>
        </div>
      </ProLayout>
    </>
  );
}