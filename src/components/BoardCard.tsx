import { Card } from 'antd'
import { useFetch } from '@/hooks';
import type  { kanbanBoard as KanbanBoardType } from 'types/index';
import { useNavigate } from '@umijs/max';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { useState, useEffect } from 'react';

interface BoardCardProps {
  id: number;
  onDelete?: (id: number) => void;
  onFavoriteChange?: () => void;
}

export default function BoardCard({id, onDelete, onFavoriteChange}: BoardCardProps){
    const {data, loading, error} = useFetch<KanbanBoardType>(`/boards/${id}`);
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const api = `http://localhost:${process.env.PORT || 3000}`;

    useEffect(() => {
        if (data) {
            setIsFavorite(data.isFavorite || false);
        }
    }, [data]);

    const MoveToBoard = () => {
        navigate(`/boards/${id}`, { state: { onDelete } });
    }

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const newFavoriteState = !isFavorite;
        
        try {
            const response = await fetch(`${api}/boards/${id}/favorite`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isFavorite: newFavoriteState }),
            });

            if (!response.ok) throw new Error('Failed to update favorite status');
            
            setIsFavorite(newFavoriteState);
            if (onFavoriteChange) {
                onFavoriteChange();
            }
        } catch (err) {
            console.error('Error updating favorite:', err);
        }
    };

    return(
        <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card 
                style={{ width: 350, height: 150, cursor: 'pointer' }} 
                onClick={MoveToBoard}
            >
                {loading && <div>Loading…</div>}
                {error && <div style={{ color: 'salmon' }}>{error}</div>}
                {!loading && !error && data && (<div>{data.name}</div>)}
            </Card>
            {(isHovered || isFavorite) && (
                <div
                    onClick={toggleFavorite}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: isFavorite ? '#faad14' : 'rgba(255, 255, 255, 0.45)',
                        transition: 'color 0.3s',
                        zIndex: 1,
                    }}
                >
                    {isFavorite ? <StarFilled /> : <StarOutlined />}
                </div>
            )}
        </div>
    );
}