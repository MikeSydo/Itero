import { useState, useEffect, useRef } from 'react';
import { List, Button, Input, Space, Dropdown, Flex } from 'antd';
import type { MenuProps } from 'antd';
import { TaskCard } from './';
import type { TasksList as TasksListType, Task } from 'types/index';
import { useFetch, useEditableName } from '../hooks';
import { DeleteOutlined } from '@ant-design/icons'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface TasksListProps {
  list: TasksListType;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export default function TasksList({ list, tasks, setTasks }: TasksListProps) {
  const { loading: loadingList, error: errorList } = useFetch<TasksListType>(`/lists/${list.id}`);
  const { data: fetchedTasks, loading: loadingTasks, error: errorTasks } = useFetch<Task[]>(`/lists/${list.id}/tasks`);
  const [isCreating, setIsCreating] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [creating, setCreating] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  
  const { attributes, listeners, setNodeRef: setSortableRef, transform, transition, isDragging } = useSortable({ 
    id: list.id,
    data: {
      type: 'list',
      list,
    },
  });
  const { setNodeRef: setDroppableRef } = useDroppable({ 
    id: list.id,
    data: {
      type: 'list',
      list,
    },
  });

  const loading = loadingList || loadingTasks;
  const error = errorList || errorTasks;

  const api =  `http://localhost:${process.env.PORT || 3000}`;

  const listNameEditor = useEditableName({
    initialName: list.name,
    onUpdate: async (newName) => {
      const response = await fetch(`${api}/lists/${list.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) throw new Error('Failed to update list name');
    },
  });

  const initialTasksSet = useRef(false);

  const refetchTasks = async () => {
    try {
      const response = await fetch(`${api}/lists/${list.id}/tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (fetchedTasks && !initialTasksSet.current) {
      setTasks(fetchedTasks);
      initialTasksSet.current = true;
    }
  }, [fetchedTasks]);

  useEffect(() => {
    if (fetchedTasks && initialTasksSet.current && fetchedTasks.length !== tasks.length) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks?.length]);

  useEffect(() => {
    const handleTaskUpdated = (event: CustomEvent) => {
      if (event.detail?.listId === list.id) {
        refetchTasks();
      }
    };

    window.addEventListener('taskUpdated', handleTaskUpdated as EventListener);
    return () => {
      window.removeEventListener('taskUpdated', handleTaskUpdated as EventListener);
    };
  }, [list.id]);

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? 1 : -1;
  });

  const handleCreateTask = async () => {
    if (!taskName.trim()) {
      return;
    }

    setCreating(true);
    try {
      const response = await fetch(`${api}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: taskName,
          listId: list.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');
      
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setTaskName('');
      setIsCreating(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    setTaskName('');
    setIsCreating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateTask();
    } else if (e.key === 'Escape') {  
      handleCancel();
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${api}/lists/${list.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
      
      setIsDeleted(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (isDeleted) {
    return null;
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined/>,
      danger: true,
      onClick: handleDelete,
    },
  ];

  const adjustedTransform = transform ? {
    ...transform,
    y: 0,
  } : transform;

  const style = {
    transform: CSS.Transform.toString(adjustedTransform),
    transition,
    background: '#3d3d3d',
    width: 300,
    minWidth: 300,
    flexShrink: 0,
    borderRadius: 8,
    opacity: isDragging ? 0.4 : 1,
  };

  const dragHandleStyle = {
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div 
      ref={setSortableRef}
      style={style}
    >
      <Flex gap={8} align="flex-start" style={{ paddingBottom: 5, padding: '10px 15px', ...dragHandleStyle, minHeight: 44 }} {...attributes} {...listeners}>
        {listNameEditor.isEditing ? (
          <Input
            value={listNameEditor.name}
            onChange={(e) => listNameEditor.setName(e.target.value)}
            onKeyDown={listNameEditor.handleKeyPress}
            onBlur={listNameEditor.cancelEdit}
            autoFocus
            style={{ margin: 0, minWidth: 50, flex: 1, maxWidth: 'calc(100% - 32px)' }}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <div  
            style={{ 
              fontSize: 20, 
              fontWeight: 600, 
              color: 'white', 
              flex: 1, 
              userSelect: 'none',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              lineHeight: 1.2,
              paddingRight: 8,
              minWidth: 0
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              listNameEditor.startEditing();
            }}
          >
            {listNameEditor.name}
          </div>
        )}
        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <Button 
            style={{ color: 'white', background:'transparent', border: 'none', fontSize: 24, padding: 0, height: 24, lineHeight: 1, flexShrink: 0}}
            onMouseEnter={(e) => {e.currentTarget.style.background = '#8c7d0d'}}
            onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent'}}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}  
          >
            ...
          </Button>
        </Dropdown>
      </Flex>
      <div 
        ref={setDroppableRef} 
        style={{ 
          minHeight: 100,
          ...dragHandleStyle
        }}
        {...attributes}
        {...listeners}
      >
        <List style={{ margin: '0 10px', marginBottom: 5, padding: 0, minHeight: 50 }}>
          <SortableContext items={sortedTasks} strategy={verticalListSortingStrategy}>
            {!loading && !error && sortedTasks && sortedTasks.map(card => (
              <TaskCard key={card.id} task={card} onDelete={() => setTasks(tasks.filter(t => t.id !== card.id))} />
            ))}
          </SortableContext>
        </List>
      </div>
      
      <div 
        style={{ padding: '0 10px 10px 10px', ...dragHandleStyle }}
        {...attributes}
        {...listeners}
      >
        {isCreating ? (
          <div style={{ marginBottom: 5 }}>
            <Input
              placeholder="Enter task name..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onKeyUp={handleKeyPress}
              autoFocus
              style={{ marginBottom: 10 }}
              onPointerDown={(e) => e.stopPropagation()}
            />
            <Space>
              <Button 
                type="primary"
                onClick={handleCreateTask}
                loading={creating}
                onPointerDown={(e) => e.stopPropagation()}
              >
                Add Task
              </Button>
              <Button onClick={handleCancel} onPointerDown={(e) => e.stopPropagation()}>
                X
              </Button>
            </Space>
          </div>
        ) : (
          <Button 
            style = {{background: '#3d3d3d', borderColor:'#3d3d3d', color: 'white', padding:10, width: '100%', display: 'flex', justifyContent: 'flex-start'}}
            onMouseEnter={(e) => e.currentTarget.style.background = '#8c7d0d'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#3d3d3d'}
            onClick={() => setIsCreating(true)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            + Create
          </Button>
        )}
      </div>
    </div>
  );
}