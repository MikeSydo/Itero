import { KanbanBoard } from "./components";

function App() {
  return (
    <div className='bg-[var(--color-bg)] min-h-screen flex flex-col'>
      <KanbanBoard id={1}></KanbanBoard>
    </div> 
  );
}

export default App
