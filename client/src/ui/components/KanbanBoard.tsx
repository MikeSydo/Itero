import type { kanbanBoard as KanbanBoardType, TasksList as TasksListType } from "../../electron/types";
import { useFetch } from "../hooks";
import { TasksList } from "./";
import { Flex } from 'antd'

export default function KanbanBoard({ id }: { id: number }) {
    const { data:board, loading:loadingBoard, error:errorBoard } = useFetch<KanbanBoardType>(`/boards/${id}`);
    const { data:lists, loading:loadingLists, error:errorLists } = useFetch<TasksListType[]>(`/boards/${id}/lists`);

    const loading = loadingBoard || loadingLists;
    const error = errorBoard || errorLists;

    return (
        <>
            <h1>
                {loading && <div style={{ color: 'white' }}>Loading…</div>}
                {!loading && !error && board && 
                    <span className='font-bold text-3xl text-white absolute top-1.5 left-10 '>
                        {board.name} <span className='p-5 text-sm font-normal text-gray-400'>ID: {board.id}</span>
                    </span>
                }
            </h1>
            <Flex style={{ overflowX: 'auto', padding: 20, paddingTop: 40, height: '100%' }} gap={20} align="start">
                {error && <div style={{ color: 'salmon' }}>{error}</div>}
                {loading && <div style={{ color: 'white' }}>Loading…</div>}
                {!loading && !error && lists && lists.map(list => (<TasksList key={list.id} id={list.id} />))}
            </Flex>
        </>
    );
}