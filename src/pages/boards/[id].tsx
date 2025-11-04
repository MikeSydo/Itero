import { useParams } from '@umijs/max';
import { KanbanBoard } from '@/components';

export default function BoardDetailPage() {
  const params = useParams<{ id: string }>();
  const boardId = Number(params.id);

  return (
    <>ABC</>
    // <div>
    //   {boardId && !Number.isNaN(boardId) ? (
    //     <KanbanBoard id={boardId} />
    //   ) : (
    //     <div style={{ padding: 24 }}>Invalid board ID</div>
    //   )}
    // </div>
  );
}

// here we parse id of board by using useMatch
//to fetch data use useEffect
