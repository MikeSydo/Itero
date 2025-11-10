import { useState, useEffect } from 'react';

interface UseEditableNameProps {
  initialName: string;
  onUpdate: (newName: string) => Promise<void>;
}

interface UseEditableNameReturn {
  name: string;
  isEditing: boolean;
  setName: (name: string) => void;
  startEditing: () => void;
  confirmEdit: () => Promise<void>;
  cancelEdit: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export function useEditableName({ 
  initialName, 
  onUpdate 
}: UseEditableNameProps): UseEditableNameReturn {
  const [name, setName] = useState(initialName);
  const [savedName, setSavedName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setName(initialName);
    setSavedName(initialName);
  }, [initialName]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const confirmEdit = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      await onUpdate(name);
      setSavedName(name);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update name:', err);
    }
  };

  const cancelEdit = () => {
    setName(savedName);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      confirmEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return {
    name,
    isEditing,
    setName,
    startEditing,
    confirmEdit,
    cancelEdit,
    handleKeyPress,
  };
}
