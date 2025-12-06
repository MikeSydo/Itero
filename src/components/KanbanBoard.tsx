import type { kanbanBoard as KanbanBoardType, TasksList as TasksListType, Task } from "types/index";
import { useFetch, useEditableName } from "../hooks";
import { TasksList } from "./";
import { Flex, Button, Input, Space, MenuProps, Dropdown } from 'antd'
import { useState, useEffect } from "react";
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent, DragOverEvent, closestCorners } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useModel, useNavigate, useIntl } from "@umijs/max";
import { ProLayout } from '@ant-design/pro-layout';
import { DeleteOutlined, StarOutlined, StarFilled } from "@ant-design/icons";

export default function KanbanBoard({ id, onDelete }: { id: number, onDelete?: (id: number) => void }) {
  const { data:board, loading:loadingBoard, error:errorBoard } = useFetch<KanbanBoardType>(`/boards/${id}`);
  const { data:lists, loading:loadingLists, error:errorLists } = useFetch<TasksListType[]>(`/boards/${id}/lists`);
  const [isCreating, setIsCreating] = useState(false);
  const [listName, setListName] = useState('');
  const [creating, setCreating] = useState(false);
  const [displayLists, setDisplayLists] = useState<TasksListType[]>([]);
  const [allTasks, setAllTasks] = useState<Record<number, Task[]>>({});
  const [isFavorite, setIsFavorite] = useState(false);
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

  const findTaskList = (taskId: number): number | null => {
    for (const [listId, tasks] of Object.entries(allTasks)) {
      if (tasks.some(task => task.id === taskId)) {
        return parseInt(listId);
      }
    }
    return null;
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    const activeListIndex = displayLists.findIndex(list => list.id === activeId);
    let overListIndex = displayLists.findIndex(list => list.id === overId);

    if (activeListIndex !== -1) {
      if (overListIndex === -1) {
        const taskListId = findTaskList(overId);
        if (taskListId) {
          overListIndex = displayLists.findIndex(list => list.id === taskListId);
        }
      }
      
      if (overListIndex !== -1 && activeListIndex !== overListIndex) {
        setDisplayLists(arrayMove(displayLists, activeListIndex, overListIndex));
      }
      return;
    }

    const activeListId = findTaskList(activeId);
    let overListId = findTaskList(overId);

    if (displayLists.some(list => list.id === overId)) {
      overListId = overId;
    }

    if (!activeListId || !overListId) return;

    setAllTasks(prev => {
      const sourceTasks = prev[activeListId] || [];
      const destTasks = prev[overListId] || [];
      
      const taskIndex = sourceTasks.findIndex(t => t.id === activeId);
      const task = sourceTasks[taskIndex];
      
      if (!task) return prev;

      if (activeListId === overListId) {
        const overIndex = sourceTasks.findIndex(t => t.id === overId);
        if (taskIndex === overIndex) return prev;
        
        return {
          ...prev,
          [activeListId]: arrayMove(sourceTasks, taskIndex, overIndex)
        };
      }

      const newSourceTasks = sourceTasks.filter(t => t.id !== activeId);
      
      let newDestTasks;
      if (displayLists.some(list => list.id === overId)) {
        newDestTasks = [...destTasks, task];
      } else {
        const overIndex = destTasks.findIndex(t => t.id === overId);
        newDestTasks = [...destTasks];
        newDestTasks.splice(overIndex, 0, task);
      }

      return {
        ...prev,
        [activeListId]: newSourceTasks,
        [overListId]: newDestTasks
      };
    });
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    const activeListIndex = displayLists.findIndex(list => list.id === activeId);
    const overListIndex = displayLists.findIndex(list => list.id === overId);

    if (activeListIndex !== -1 && overListIndex !== -1) {
      const newLists = arrayMove(displayLists, activeListIndex, overListIndex);
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
      return;
    }

    const activeListId = findTaskList(activeId);
    let overListId = findTaskList(overId);

    if (displayLists.some(list => list.id === overId)) {
      overListId = overId;
    }

    if (!activeListId || !overListId) return;

    const targetTasks = allTasks[overListId] || [];
    
    try {
      await Promise.all(
        targetTasks.map((task, index) =>
          fetch(`${api}/tasks/${task.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              listId: overListId,
              position: index
            }),
          })
        )
      );

      if (activeListId !== overListId) {
        const sourceTasks = allTasks[activeListId] || [];
        await Promise.all(
          sourceTasks.map((task, index) =>
            fetch(`${api}/tasks/${task.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                position: index
              }),
            })
          )
        );
        
        const [sourceTasksResponse, targetTasksResponse] = await Promise.all([
          fetch(`${api}/lists/${activeListId}/tasks`).then(res => res.json()),
          fetch(`${api}/lists/${overListId}/tasks`).then(res => res.json())
        ]);
        
        setAllTasks(prev => ({
          ...prev,
          [activeListId]: sourceTasksResponse,
          [overListId]: targetTasksResponse
        }));
      } else {
        const tasksResponse = await fetch(`${api}/lists/${activeListId}/tasks`).then(res => res.json());
        setAllTasks(prev => ({
          ...prev,
          [activeListId]: tasksResponse
        }));
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  }

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
        title = "itero"
        layout="top"
        navTheme={isDarkTheme ? 'realDark' : 'light'}
        fixedHeader
        menuRender={false}
        footerRender={false}
        contentStyle={{ padding: 0, margin: 0 }}
        style={{ '--ant-pro-layout-header-border': 'none'} as any}
        headerContentRender={() => (
          <Flex justify="left" align="center" style={{ width: '100%' }}>
            <Button 
              type="text" 
              onClick={() => navigate('/boards')}
              style={{ color: 'white', fontSize: 16 }}
            >
              Boards
            </Button>
          </Flex>
        )}>
        <div style={{ background: '#2a3245', minHeight: 'calc(100vh - 64px)', border: 'none' }}>
          <Flex justify="space-between" align="center" style={{ padding: '16px 24px', background: 'rgba(0, 0, 0, 0.2)', 
            backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
            {boardNameEditor.isEditing ? (
              <Input
                value={boardNameEditor.name}
                onChange={(e) => boardNameEditor.setName(e.target.value)}
                onKeyDown={boardNameEditor.handleKeyPress}
                onBlur={boardNameEditor.cancelEdit}
                autoFocus
                style={{ margin: 0, minWidth: 50, width:70 }}
              />
            ) : (
              <Button
                style={{ fontSize: 30, margin: 0, background: 'transparent', border: 'none', color: 'white', minWidth: 50}}
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
          <Flex style={{ overflowX: 'auto', padding: 20, paddingTop: 40, height: '100%' }} gap={20} align="start">
            {error && <div style={{ color: 'salmon' }}>{error}</div>}
            {loading && <div style={{ color: 'Black' }}>Loading…</div>}
            <DndContext 
              sensors={sensors} 
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              collisionDetection={closestCorners}
            >
              <SortableContext items={displayLists} strategy={horizontalListSortingStrategy}>
                {!loading && !error && displayLists && displayLists.map(list => (
                  <TasksList 
                    key={list.id} 
                    list={list}
                    tasks={allTasks[list.id] || []}
                    setTasks={(tasks) => setAllTasks(prev => ({ ...prev, [list.id]: tasks }))}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {isCreating ? (
                    <div style={{ marginLeft: 20, marginBottom: 5, width: 300 }}>
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
                      style = {{height: 60, fontSize: 25, opacity: 0.7, background: '#686d78', borderColor:'#3d3d3d', color: 'white', marginLeft:20, marginBottom:5, padding:10, width: 300, display: 'flex', justifyContent: 'flex-start'}}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#8c7d0d'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#3d3d3d'}
                      onClick={() => setIsCreating(true)}
                    >
                    + New List
                    </Button>
                )
            }
          </Flex>
        </div>
      </ProLayout>
    </>
  );
}