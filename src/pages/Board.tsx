import { KanbanBoard } from '@/components';
import { useMatch } from '@umijs/max';

export default function Board() {
  const match = useMatch('/boards/:boardId');
  const boardId = Number(match?.params.boardId);

  return (
    <div>
      {boardId && !Number.isNaN(boardId) ? (
        <KanbanBoard id={boardId} />
      ) : (
        <div style={{ padding: 24 }}>Invalid board ID</div>
      )}
    </div>
  );
}

// here we parse id of board by using useMatch
//to fetch data use useEffect
