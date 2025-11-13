import { Card } from 'antd'
import { useFetch } from '@/hooks';
import type  { kanbanBoard as KanbanBoardType } from 'types/index';
import { useNavigate } from '@umijs/max';

export default function BoardCard({id}: {id: number}){
    const {data, loading, error} = useFetch<KanbanBoardType>(`/boards/${id}`);
    const navigate = useNavigate();

    const MoveToBoard = () => {
        navigate(`/boards/${id}`);
    }

    return(
        <Card style = {{ width: 350, height: 150}} onClick={MoveToBoard}>
            {loading && <div>Loading…</div>}
            {error && <div style={{ color: 'salmon' }}>{error}</div>}
            {!loading && !error && data && (<div>{data.name}</div>)}
        </Card>
    );
}