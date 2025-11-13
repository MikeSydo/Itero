import type { kanbanBoard as KanbanBoardType, TasksList as TasksListType, Task } from "types/index";
import { useFetch, useEditableName } from "../hooks";
import { TasksList } from "./";
import { Flex, Button, Input, Space } from 'antd'
import { useState, useEffect } from "react";
import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors, DragEndEvent, DragOverEvent, closestCorners, pointerWithin, rectIntersection } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useNavigate } from "@umijs/max";
import { ProLayout } from '@ant-design/pro-layout';

export default function KanbanBoard({ id }: { id: number }) {
  const { data:board, loading:loadingBoard, error:errorBoard } = useFetch<KanbanBoardType>(`/boards/${id}`);
  const { data:lists, loading:loadingLists, error:errorLists } = useFetch<TasksListType[]>(`/boards/${id}/lists`);
  const [isCreating, setIsCreating] = useState(false);
  const [listName, setListName] = useState('');
  const [creating, setCreating] = useState(false);
  const [displayLists, setDisplayLists] = useState<TasksListType[]>([]);
  const [allTasks, setAllTasks] = useState<Record<number, Task[]>>({});

  const loading = loadingBoard || loadingLists;
  const error = errorBoard || errorLists;
  const api =  `http://localhost:${process.env.PORT || 3000}`;
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

    // Check if dragging a list - don't handle in dragOver
    const activeListIndex = displayLists.findIndex(list => list.id === activeId);
    if (activeListIndex !== -1) return;

    // Find which lists the active and over items belong to
    const activeListId = findTaskList(activeId);
    let overListId = findTaskList(overId);

    // If over is a list (droppable), use that list
    if (displayLists.some(list => list.id === overId)) {
      overListId = overId;
    }

    if (!activeListId || !overListId) return;

    // Moving to different list or reordering within same list
    setAllTasks(prev => {
      const sourceTasks = prev[activeListId] || [];
      const destTasks = prev[overListId] || [];
      
      const taskIndex = sourceTasks.findIndex(t => t.id === activeId);
      const task = sourceTasks[taskIndex];
      
      if (!task) return prev;

      // If same list, use arrayMove for smooth reordering
      if (activeListId === overListId) {
        const overIndex = sourceTasks.findIndex(t => t.id === overId);
        if (taskIndex === overIndex) return prev;
        
        return {
          ...prev,
          [activeListId]: arrayMove(sourceTasks, taskIndex, overIndex)
        };
      }

      // Different lists
      const newSourceTasks = sourceTasks.filter(t => t.id !== activeId);
      
      // Find position in destination list
      let newDestTasks;
      if (displayLists.some(list => list.id === overId)) {
        // Dropped on list itself - add to end
        newDestTasks = [...destTasks, task];
      } else {
        // Dropped on a task - insert at that position
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    // Check if dragging a list
    const activeListIndex = displayLists.findIndex(list => list.id === activeId);
    const overListIndex = displayLists.findIndex(list => list.id === overId);

    if (activeListIndex !== -1 && overListIndex !== -1) {
      // Dragging lists
      setDisplayLists((items) => arrayMove(items, activeListIndex, overListIndex));
      return;
    }

    // Dragging a task - update server if moved to different list
    const activeListId = findTaskList(activeId);
    let overListId = findTaskList(overId);

    // If over is a list (droppable), use that list
    if (displayLists.some(list => list.id === overId)) {
      overListId = overId;
    }

    if (!activeListId) return;

    if (activeListId !== overListId && overListId) {
      // Moved to different list - update on server
      fetch(`${api}/tasks/${activeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId: overListId }),
      }).catch(err => console.error('Failed to update task list:', err));
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

  return (
    <>
      <ProLayout
        title="Ant Design Pro"
        layout="top"
        navTheme="realDark"
        fixedHeader
        menuRender={false}
        footerRender={false}
        onMenuHeaderClick={() => navigate('/boards')}
        contentStyle={{ padding: 0, margin: 0 }}
        style={{ '--ant-pro-layout-header-border': 'none'} as any}>
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
              <Button>+ Поділитися(Not worked)</Button> 
              <Button>...(Not worked)</Button>
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
                    id={list.id} 
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