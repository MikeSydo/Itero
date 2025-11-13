import { Outlet } from '@umijs/max';
import { BoardCard } from '@/components';
import { kanbanBoard } from 'types/index';
import { useState, useEffect } from 'react';
import { Button } from 'antd';

export default function Boards() {
  const [boardsId, setBoardsId] = useState<number[]>([]);

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
  //TODO: add button to create board
  return (
    <>
      <Outlet/>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start' }}>
        {boardsId.map(id => <BoardCard key={id} id={id}></BoardCard>)}
        <Button>+ New Board</Button>
      </div>
    </>
  );
}