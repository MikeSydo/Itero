import { useState, useEffect } from 'react';
import { useParams } from '@umijs/max';
import { Calendar, Paperclip, Trash2, Download, Loader } from 'lucide-react';
import { useFetch } from '@/hooks';
import type { Task, Attachment } from 'types/index';

export default function Task() {
  const { cardId } = useParams<{ cardId: string }>();
  const taskId = Number(cardId);
  
  const { data: task, loading: loadingTask, error: errorTask } = useFetch<Task>(`/tasks/${taskId}`);
  
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  const api = `http://localhost:${process.env.PORT || 3000}`;

  useEffect(() => {
    if (task) {
      setTaskName(task.name);
      setDescription(task.description || '');
      if (task.startedDate) setStartDate(task.startedDate.split('T')[0]);
      if (task.endDate) setEndDate(task.endDate.split('T')[0]);
    }
  }, [task]);

  useEffect(() => {
    if (taskId) {
      fetchAttachments();
    }
  }, [taskId]);
  
  const updateTaskName = async (value: string) => {
    if (!taskId || !value.trim()) return;
    
    try {
      const response = await fetch(`${api}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value.trim() }),
      });
      if (!response.ok) throw new Error('Failed to update task name');
      window.dispatchEvent(new CustomEvent('taskUpdated', { 
        detail: { taskId, listId: task?.listId } 
      }));

      setIsEditingName(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttachments = async () => {
    if (!taskId) return;
    
    try {
      const response = await fetch(`${api}/tasks/${taskId}/attachments`);
      if (response.ok) {
        const data = await response.json();
        setAttachments(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateDescription = async (value: string) => {
    if (!taskId) return;
    
    try {
      const response = await fetch(`${api}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: value }),
      });
      if (!response.ok) throw new Error('Failed to update description');
    } catch (error) {
      console.error(error);
    }
  };

  const updateDates = async (start: string, end: string) => {
    if (!taskId) return;
    
    try {
      const response = await fetch(`${api}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startedDate: start ? new Date(start).toISOString() : null,
          endDate: end ? new Date(end).toISOString() : null,
        }),
      });
      if (!response.ok) throw new Error('Failed to update dates');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !taskId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${api}/tasks/${taskId}/attachments`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload file');
      fetchAttachments();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteAttachment = async (attachmentId: number) => {
    try {
      const response = await fetch(`${api}/tasks/attachments/${attachmentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete attachment');
      setAttachments(attachments.filter(a => a.id !== attachmentId));
    } catch (error) {
      console.error(error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loadingTask) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  if (!taskId) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#ff4d4f' }}>
        Error: Task ID not found
      </div>
    );
  }

  if (errorTask || !task) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#ff4d4f' }}>
        {errorTask || 'Task not found'}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0', maxWidth: 800, margin: '0 auto' }}>
      {isEditingName ? (
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          onBlur={() => updateTaskName(taskName)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateTaskName(taskName);
            } else if (e.key === 'Escape') {
              setTaskName(task.name);
              setIsEditingName(false);
            }
          }}
          autoFocus
          style={{
            width: '100%',
            marginBottom: 20,
            fontSize: 20,
            fontWeight: 600,
            padding: '8px 12px',
            border: '2px solid #1890ff',
            borderRadius: 6,
            outline: 'none',
            color: '#000',
            backgroundColor: '#fff'
          }}
        />
      ) : (
        <h2 
          onClick={() => setIsEditingName(true)}
          style={{ 
            marginBottom: 20, 
            fontSize: 20, 
            fontWeight: 600,
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 6,
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {taskName}
        </h2>
      )}

      {/* Description */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => updateDescription(description)}
          placeholder="Add description..."
          style={{
            width: '100%',
            minHeight: 100,
            padding: 12,
            fontSize: 14,
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Dates */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            marginBottom: 12,
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          <Calendar size={16} />
          Dates
        </button>
        
        {showDatePicker && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#888' }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  updateDates(e.target.value, endDate);
                }}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: 6,
                  fontSize: 14
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#888' }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  updateDates(startDate, e.target.value);
                }}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: 6,
                  fontSize: 14
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Attachments */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
          Attachments
        </label>
        <label style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          background: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: 6,
          cursor: uploading ? 'not-allowed' : 'pointer',
          fontSize: 14,
          opacity: uploading ? 0.6 : 1
        }}>
          {uploading ? <Loader className="animate-spin" size={16} /> : <Paperclip size={16} />}
          {uploading ? 'Uploading...' : 'Add file'}
          <input
            type="file"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>

        {attachments.length > 0 && (
          <div style={{ marginTop: 16 }}>
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: 6,
                  marginBottom: 8,
                  backgroundColor: '#fafafa'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {attachment.fileName}
                  </div>
                  <div style={{ fontSize: 12, color: '#888' }}>
                    {formatFileSize(attachment.fileSize)} • {formatDate(attachment.uploadedAt)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => window.open(`${api}${attachment.fileUrl}`, '_blank')}
                    style={{
                      padding: 8,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#1890ff'
                    }}
                    title="Download"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteAttachment(attachment.id)}
                    style={{
                      padding: 8,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ff4d4f'
                    }}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}