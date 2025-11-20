import { KanbanBoard } from '@/components';
import { useMatch, useOutletContext, useLocation, useNavigate, Outlet } from '@umijs/max';
import { Modal } from 'antd';

interface BoardsContext {
  onDeleteBoard?: (id: number) => void;
}

export default function Board() {
  const match = useMatch('/boards/:boardId/*');
  const boardId = Number(match?.params.boardId);
  const context = useOutletContext<BoardsContext>();
  const location = useLocation();
  const locationState = location.state as { onDelete?: (id: number) => void } | null;
  const onDelete = locationState?.onDelete || context?.onDeleteBoard;
  const navigate = useNavigate();
  const isCardOpen = location.pathname.includes('/c/');
  
  return (
    <div>
      {boardId && !Number.isNaN(boardId) ? (
        <KanbanBoard id={boardId} onDelete={onDelete} />
      ) : (
        <div style={{ padding: 24 }}>Invalid board ID</div>
      )}
      {isCardOpen && (
        <Modal
          open={true}
          onCancel={() => navigate(-1)}
          footer={null}
          width={300}
        >
          <Outlet />
        </Modal>
      )}
    </div>
  );
}
