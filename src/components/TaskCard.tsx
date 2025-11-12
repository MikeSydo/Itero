import { useState } from 'react';
import { Card, Button, Dropdown, Input } from 'antd';
import type { MenuProps } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { Task } from 'types/index';
import { useFetch, useEditableName } from '../hooks';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskCard({ id }: { id: number}) {
  const { data: task, loading, error } = useFetch<Task>(`/tasks/${id}`);
  const [isDeleted, setIsDeleted] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const api = `http://localhost:${process.env.PORT || 3000}`;

  const taskNameEditor = useEditableName({
    initialName: task?.name || '',
    onUpdate: async (newName) => {
      const response = await fetch(`${api}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) throw new Error('Failed to update task name');
    },
  });

  const handleDelete = async () => {
    try {
      const api =  `http://localhost:${process.env.PORT || 3000}`;
      const response = await fetch(`${api}/tasks/${id}`, {
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
    background: 'black',
    marginBottom: 10,
    cursor: 'grab',
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      title={<span style={{color:'white'}}>{loading ? 'Loading…' : task ? task.name : error ?? 'Error'}</span>} ////FIXME: setup behavior for very long card names 
      variant='borderless'
      style={style}
      styles={{header:{borderBottom: 0, background: 'black'}, body:{background:'black', color:'white', marginTop:-30}}}
    >
      <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
        <Button 
          style={{ position: 'absolute', top: 12, right: 10, color: 'white', background:'black', borderColor:'Black', fontSize: 30, paddingBottom: 15}}
          onMouseEnter={(e) => {e.currentTarget.style.background = '#8c7d0d'}}
          onMouseLeave={(e) => {e.currentTarget.style.background = 'black'}}
          onPointerDown={(e) => e.stopPropagation()}
        >
          ...
        </Button>
      </Dropdown>
      {loading && <div>Loading…</div>}
      {error && <div style={{ color: 'salmon' }}>{error}</div>}
      {!loading && !error && task && (<div style={{ opacity: 0.7 }}>ID: {task.id}</div>)}
    </Card>
  );
}