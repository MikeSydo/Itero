import TaskCard from './components/TaskCard';
import { List } from 'antd';
import { useTasks } from './hooks/useTasks';

function App() {
  const { taskIds, loading, error } = useTasks();

  return (
    <div className='bg-[var(--color-bg)] min-h-screen flex flex-col'>
      <List
        className="ListTasks"
        style={{ background: 'grey', margin: 20, padding: 20, width: 300 }}
      >
        {loading && <div style={{ color: 'white' }}>Loading…</div>}
        {error && <div style={{ color: 'salmon' }}>{error}</div>}
        {!loading && !error && taskIds.map((id) => (
          <TaskCard key={id} id={id} />
        ))}
        {!loading && !error && taskIds.length === 0 && (
          <div style={{ color: 'white', opacity: 0.8 }}>No tasks</div>
        )}
      </List>
    </div>
  );
}

export default App
