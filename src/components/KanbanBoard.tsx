import type { kanbanBoard as KanbanBoardType, TasksList as TasksListType } from "types/index";
import { useFetch } from "../hooks";
import { TasksList } from "./";
import { Flex, Button, Input, Space, Typography } from 'antd'
import { useState, useEffect } from "react";
import { ShareAltOutlined, StarOutlined } from "@ant-design/icons";

export default function KanbanBoard({ id }: { id: number }) {
    const { data:board, loading:loadingBoard, error:errorBoard } = useFetch<KanbanBoardType>(`/boards/${id}`);
    const { data:lists, loading:loadingLists, error:errorLists } = useFetch<TasksListType[]>(`/boards/${id}/lists`);
    const [isCreating, setIsCreating] = useState(false);
    const [listName, setListName] = useState('');
    const [creating, setCreating] = useState(false);
    const [displayLists, setDisplayLists] = useState<TasksListType[]>([]);

    const loading = loadingBoard || loadingLists;
    const error = errorBoard || errorLists;
    const api =  `http://localhost:${process.env.PORT || 3000}`;

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateList();
    }
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <Flex   
        justify="space-between" 
        align="center" 
        style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10}}
      >
        <Typography.Title level={2} style={{ margin: 0 }}>
          {board?.name}
        </Typography.Title>
      </Flex>
      <Flex style={{ overflowX: 'auto', padding: 20, paddingTop: 40, height: '100%' }} gap={20} align="start">
          {error && <div style={{ color: 'salmon' }}>{error}</div>}
          {loading && <div style={{ color: 'Black' }}>Loading…</div>}
          {!loading && !error && displayLists && displayLists.map(list => (<TasksList key={list.id} id={list.id} />))}
          {isCreating ? (
                  <div style={{ marginLeft: 20, marginBottom: 5, width: 300 }}>
                  <Input
                      placeholder="Enter list name..."
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      onKeyUp={handleKeyPress}
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
                  style = {{background: '#3d3d3d', borderColor:'#3d3d3d', color: 'white', marginLeft:20, marginBottom:5, padding:10, width: 300, display: 'flex', justifyContent: 'flex-start'}}
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
  );
}