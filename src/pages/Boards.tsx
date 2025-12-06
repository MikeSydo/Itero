import { Outlet } from '@umijs/max';
import { BoardCard } from '@/components';
import { kanbanBoard } from 'types/index';
import { useState, useEffect } from 'react';
import { Button, Card, Input } from 'antd';

export default function Boards() {
  const [boardsId, setBoardsId] = useState<number[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [creating, setCreating] = useState(false);

  const api =  `http://localhost:${process.env.PORT || 3000}`;

  const getBoardsId = async () => {
    const response = await fetch(`http://localhost:3000/boards`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const boardsId: number[] = result.map((board: { id: number }) => { return board.id });
    return boardsId;
  }

  useEffect(() => {
    getBoardsId().then(setBoardsId);
  }, []);

  const handleCreateBoard = async () => {
    if(!boardName.trim()) return;
    setCreating(true);
    try {
      const response = await fetch(`${api}/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: boardName,
        }),
      });

      if (!response.ok) throw new Error('Failed to create board');
      
      const newBoard = await response.json();
      setBoardsId([...boardsId, newBoard.id]);
      setBoardName('');
      setIsCreating(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  }

  const handleCancel = () => {
    setBoardName('');
    setIsCreating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateBoard();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDeleteBoard = (deletedBoardId: number) => {
    setBoardsId(boardsId.filter(id => id !== deletedBoardId));
  };

  return (
    <>
      <Outlet context={{ onDeleteBoard: handleDeleteBoard }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start' }}>
        {boardsId.map(id => <BoardCard key={id} boardId={id} onDelete={handleDeleteBoard} />)}
        {isCreating ? (
          <Card style={{ width: 350, height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Input
              placeholder="Enter board name..."
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              style={{ marginBottom: 10 }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="primary" onClick={handleCreateBoard} loading={creating}>
                Create
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </div>
          </Card>
        ) : (
          <Button 
            style={{ width: 350, height: 150 }} 
            onClick={() => setIsCreating(true)}
          >
            + New Board
          </Button>
        )}
      </div>
    </>
  );
}