import TasksList from './components/TasksList';

function App() {
  return (
    <div className='bg-[var(--color-bg)] min-h-screen flex flex-col'>
      <TasksList id={1}></TasksList>
      <TasksList id={2}></TasksList>
    </div> 
  );
}

export default App
