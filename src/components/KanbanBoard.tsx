import type { kanbanBoard as KanbanBoardType, TasksList as TasksListType } from "types/index";
import { useFetch, useEditableName } from "../hooks";
import { TasksList } from "./";
import { Flex, Button, Input, Space } from 'antd'
import { useState, useEffect } from "react";
import { DndContext, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useModel, useNavigate } from "@umijs/max";
import { ProLayout } from '@ant-design/pro-layout';

export default function KanbanBoard({ id }: { id: number }) {
  const { data:board, loading:loadingBoard, error:errorBoard } = useFetch<KanbanBoardType>(`/boards/${id}`);
  const { data:lists, loading:loadingLists, error:errorLists } = useFetch<TasksListType[]>(`/boards/${id}/lists`);
  const [isCreating, setIsCreating] = useState(false);
  const [listName, setListName] = useState('');
  const [creating, setCreating] = useState(false);
  const [displayLists, setDisplayLists] = useState<TasksListType[]>([]);
  const { initialState } = useModel('@@initialState');

  const loading = loadingBoard || loadingLists;
  const error = errorBoard || errorLists;
  const api =  `http://localhost:${process.env.PORT || 3000}`;
  const isDarkTheme = initialState?.settings?.navTheme === 'realDark';
  const navigate = useNavigate();

  const boardNameEditor = useEditableName({
      initialName: board?.name || '',
      onUpdate: async (newName) => {
          const response = await fetch(`${api}/boards/${id}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: newName }),
          });
          if (!response.ok) throw new Error('Failed to update board name');
      },
  });

  useEffect(() => {
      if (lists) {
          setDisplayLists(lists);
      }
  }, [lists]);

  const handleCreateList = async () => {
  if (!listName.trim()) {
    return;
  }

  setCreating(true);
    try {
      const response = await fetch(`${api}/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: listName,
          boardId: id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create list');

      const newList = await response.json();
      setDisplayLists([...displayLists, newList]);
      setListName('');
      setIsCreating(false);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    setListName('');
    setIsCreating(false);
  };

  const handleCreateListKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateList();
    }
  };

  const getListPos = (id: number) => {
    return displayLists.findIndex(list => list.id === id);
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id === over.id) return;
    setDisplayLists((items) => {
      const originalPos = getListPos(active.id);
      const newPos = getListPos(over.id);
      return arrayMove(items, originalPos, newPos);
    });
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  return (
    <>
      <ProLayout
        title = "itero"
        layout="top"
        navTheme={isDarkTheme ? 'realDark' : 'light'}
        fixedHeader
        menuRender={false}
        footerRender={false}
        onMenuHeaderClick={() => navigate('/boards')}
        contentStyle={{ padding: 0, margin: 0 }}
        style={{ '--ant-pro-layout-header-border': 'none'} as any}>
        <div style={{ background: '#2a3245', minHeight: 'calc(100vh - 64px)', border: 'none' }}>
          <Flex justify="space-between" align="center" style={{ padding: '16px 24px', background: 'rgba(0, 0, 0, 0.2)', 
            backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
            {boardNameEditor.isEditing ? (
              <Input
                value={boardNameEditor.name}
                onChange={(e) => boardNameEditor.setName(e.target.value)}
                onKeyDown={boardNameEditor.handleKeyPress}
                onBlur={boardNameEditor.cancelEdit}
                autoFocus
                style={{ margin: 0, minWidth: 50, width:70 }}
              />
            ) : (
              <Button  //FIXME: setup behavior for very long board names 
                style={{ fontSize: 30, margin: 0, background: 'transparent', border: 'none', color: 'white', minWidth: 50}}
                onClick={boardNameEditor.startEditing}
              >
                {boardNameEditor.name}
              </Button>
            )}
            <Space>
              <Button>...</Button>
            </Space>
          </Flex>
          <Flex style={{ overflowX: 'auto', padding: 20, paddingTop: 40, height: '100%' }} gap={20} align="start">
            {error && <div style={{ color: 'salmon' }}>{error}</div>}
            {loading && <div style={{ color: 'Black' }}>Loading…</div>}
            <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
              <SortableContext items={displayLists} strategy={horizontalListSortingStrategy}>
                {!loading && !error && displayLists && displayLists.map(list => (<TasksList key={list.id} id={list.id} />))}
              </SortableContext>
            </DndContext>
            {isCreating ? (
                    <div style={{ marginLeft: 20, marginBottom: 5, width: 300 }}>
                    <Input
                        placeholder="Enter list name..."
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        onKeyUp={handleCreateListKeyPress}
                        autoFocus
                        style={{ marginBottom: 10 }}
                    />
                    <Space>
                        <Button 
                        type="primary"
                        onClick={handleCreateList}
                        loading={creating}
                        >
                        Add List
                        </Button>
                        <Button onClick={handleCancel}>
                        X
                        </Button>
                    </Space>
                    </div>
                ) : (
                    <Button 
                      style = {{height: 60, fontSize: 25, opacity: 0.7, background: '#686d78', borderColor:'#3d3d3d', color: 'white', marginLeft:20, marginBottom:5, padding:10, width: 300, display: 'flex', justifyContent: 'flex-start'}}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#8c7d0d'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#3d3d3d'}
                      onClick={() => setIsCreating(true)}
                    >
                    + New List
                    </Button>
                )
            }
          </Flex>
        </div>
      </ProLayout>
    </>
  );
}