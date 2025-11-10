import { useState, useEffect } from 'react';
import { List, Button, Input, Space, Dropdown, Flex } from 'antd';
import type { MenuProps } from 'antd';
import { TaskCard } from './';
import type { TasksList as TasksListType, Task } from 'types/index';
import { useFetch, useEditableName } from '../hooks';
import { DeleteOutlined } from '@ant-design/icons'
import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext,  useSortable,  verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TasksList({ id }: { id: number }) {
  const { data: list, loading: loadingList, error: errorList } = useFetch<TasksListType>(`/lists/${id}`);
  const { data: tasks, loading: loadingTasks, error: errorTasks } = useFetch<Task[]>(`/lists/${id}/tasks`);
  const [isCreating, setIsCreating] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [creating, setCreating] = useState(false);
  const [tasksList, setTaskList] = useState<Task[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const loading = loadingList || loadingTasks;
  const error = errorList || errorTasks;

  const api =  `http://localhost:${process.env.PORT || 3000}`;

  const listNameEditor = useEditableName({
    initialName: list?.name || '',
    onUpdate: async (newName) => {
      const response = await fetch(`${api}/lists/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) throw new Error('Failed to update list name');
    },
  });

  useEffect(() => {
    if (tasks) {
      setTaskList(tasks);
    }
  }, [tasks]);

  const getTaskPos = (id: number) => {
    return tasksList.findIndex(task => task.id === id);
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    setTaskList((items) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);
      return arrayMove(items, originalPos, newPos);
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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
          listId: id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');
      
      const newTask = await response.json();
      setTaskList([...tasksList, newTask]);
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
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${api}/lists/${id}`, {
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

  const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      background: '#3d3d3d',
    };

  return (
    <div 
      ref={setNodeRef}
      style={style}
    >
      <Flex gap= {160 } {...attributes} {...listeners} style={{ cursor: 'grab', paddingBottom: 5 }}>
        {listNameEditor.isEditing ? (
          <Input
            value={listNameEditor.name}
            onChange={(e) => listNameEditor.setName(e.target.value)}
            onKeyDown={listNameEditor.handleKeyPress}
            onBlur={listNameEditor.cancelEdit}
            autoFocus
            style={{ margin: 10, minWidth: 50, width:70 }}
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <div  
            style={{ fontSize: 25, margin: 10, marginTop: 15, color: 'white', minWidth: 50, userSelect: 'none'}}
            onDoubleClick={listNameEditor.startEditing}
          >
            {listNameEditor.name}
          </div>
        )}
        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <Button 
            style={{ marginTop: 15, color: 'white', background:'#3d3d3d', borderColor:'#3d3d3d', fontSize: 30, paddingBottom: 15}}
            onMouseEnter={(e) => {e.currentTarget.style.background = '#8c7d0d'}}
            onMouseLeave={(e) => {e.currentTarget.style.background = '#3d3d3d'}}
            onPointerDown={(e) => e.stopPropagation()}
          >
            ...
          </Button>
        </Dropdown>
      </Flex>
      <List
        style={{ margin:20, marginBottom: 5, width: 300 }}
      >
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          <SortableContext items={tasksList} strategy={verticalListSortingStrategy}>
            {!loading && !error && tasksList && tasksList.map(card => (<TaskCard key={card.id} id={card.id} />))}
          </SortableContext>
        </DndContext>
      </List>
      
      {isCreating ? (
        <div style={{ marginLeft: 20, marginBottom: 5, width: 300 }}>
          <Input
            placeholder="Enter task name..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyUp={handleKeyPress}
            autoFocus
            style={{ marginBottom: 10 }}
          />
          <Space>
            <Button 
              type="primary"
              onClick={handleCreateTask}
              loading={creating}
            >
              Add Task
            </Button>
            <Button onClick={handleCancel}>
              X
            </Button>
          </Space>
        </div>
      ) : (
        <Button 
          style = {{background: '#3d3d3d', borderColor:'#3d3d3d', color: 'white', marginLeft:20, marginBottom:5, padding:10, width: 300, display: 'flex', justifyContent: 'flex-start'}}
          onMouseEnter={(e) => e.currentTarget.style.background = '#8c7d0d'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#3d3d3d'}
          onClick={() => setIsCreating(true)}
        >
          + Create
        </Button>
      )}
    </div>
  );
}