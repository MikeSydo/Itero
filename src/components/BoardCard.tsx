import { Card } from 'antd'
import { useFetch } from '@/hooks';
import type  { kanbanBoard as KanbanBoardType } from 'types/index';
import { useNavigate } from '@umijs/max';

interface BoardCardProps {
  id: number;
  onDelete?: (id: number) => void;
}

export default function BoardCard({id, onDelete}: BoardCardProps){
    const {data, loading, error} = useFetch<KanbanBoardType>(`/boards/${id}`);
    const navigate = useNavigate();

    const MoveToBoard = () => {
        navigate(`/boards/${id}`, { state: { onDelete } });
    }

    return(
        <Card style = {{ width: 350, height: 150}} onClick={MoveToBoard}>
            {loading && <div>Loading…</div>}
            {error && <div style={{ color: 'salmon' }}>{error}</div>}
            {!loading && !error && data && (<div>{data.name}</div>)}
        </Card>
    );
}