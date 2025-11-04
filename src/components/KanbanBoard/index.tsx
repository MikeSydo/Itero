import { useRequest } from '@umijs/max';
import { Space } from 'antd';
import { getBoard, getBoardLists } from '@/services';
import type {
  KanbanBoard as KanbanBoardType,
  TasksList as TasksListType,
} from '@/services/typings';
import TasksList from '../TasksList';

interface KanbanBoardProps {
  id: number;
}

export default function KanbanBoard({ id }: KanbanBoardProps) {
  const { data: board, loading: loadingBoard } = useRequest(
    () => getBoard(id),
    {
      refreshDeps: [id],
      onSuccess: (result) =>
        getBoard(id).then((hru) => console.log(hru, result)),
      onError: (error) => console.error('Error fetching board:', error),
    },
  ) as {
    data: KanbanBoardType | undefined;
    loading: boolean;
  };

  const {
    data: lists,
    loading: loadingLists,
    refresh,
  } = useRequest(() => getBoardLists(id), {
    refreshDeps: [id],
  }) as {
    data: TasksListType[] | undefined;
    loading: boolean;
    refresh: () => void;
  };

  const loading = loadingBoard || loadingLists;

  return (
    <div>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
        <>
          <h1 style={{ margin: 0, fontSize: 24 }}>
            {loading ? 'Loading…' : board?.name}
          </h1>
          {board && (
            <div style={{ fontSize: 14, opacity: 0.6, marginTop: 4 }}>
              Board ID: {board.id}
            </div>
          )}
        </>
        {!board && <h1>hruhru</h1>}
      </div>

      <div
        style={{
          padding: 24,
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        <Space align="start" size="middle">
          {loading && <div>Loading lists...</div>}
          {!loading &&
            lists &&
            lists.map((list: TasksListType) => (
              <TasksList key={list.id} id={list.id} onDelete={refresh} />
            ))}
        </Space>
      </div>
    </div>
  );
}
