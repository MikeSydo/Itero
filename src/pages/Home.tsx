import { PageContainer } from '@ant-design/pro-components';
import React, { useState, useEffect } from 'react';
import { BoardCard } from '@/components';
import { Typography, Spin, Empty } from 'antd';
import type { kanbanBoard } from 'types/index';

const { Title } = Typography;

const Home: React.FC = () => {
  const [favoriteBoards, setFavoriteBoards] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const api = `http://localhost:${process.env.PORT || 3000}`;

  const getFavoriteBoards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/boards`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const boards: kanbanBoard[] = await response.json();
      const favoriteBoardIds = boards
        .filter(board => board.isFavorite)
        .map(board => board.id);
      setFavoriteBoards(favoriteBoardIds);
    } catch (error) {
      console.error('Error fetching favorite boards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFavoriteBoards();
  }, []);

  const handleFavoriteChange = () => {
    getFavoriteBoards();
  };

  return (
    <PageContainer title="Favorites">
      <div style={{ padding: '20px' }}>
        <Title level={3}>Favorite Boards</Title>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
          </div>
        ) : favoriteBoards.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 350px)', 
            gap: '16px', 
            marginTop: '20px' 
          }}>
            {favoriteBoards.map(id => (
              <BoardCard key={id} boardId={id} onFavoriteChange={handleFavoriteChange} />
            ))}
          </div>
        ) : (
          <Empty 
            description="No favorite boards" 
            style={{ marginTop: '40px' }}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default Home;
