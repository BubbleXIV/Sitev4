import React, { useState } from 'react';
import { PageContentItem } from '../endpoints/page-content/get_GET.schema';
import { EditableContentRenderer } from './EditableContentRenderer';
import { BlockEditor } from './BlockEditor';
import { Button } from './Button';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import styles from './ContentBlock.module.css';

interface ContentBlockProps {
  block: PageContentItem;
  onUpdate: (sectionKey: string, newContent: string) => void;
  onDelete: (sectionKey: string) => void;
  className?: string;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({ block, onUpdate, onDelete, className }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (newContent: string) => {
    onUpdate(block.sectionKey, newContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.controls}>
        <div className={styles.dragHandle}>
          <GripVertical size={18} />
        </div>
        <span className={styles.blockType}>{block.contentType}</span>
        <div className={styles.actions}>
          <Button variant="ghost" size="icon-sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit size={14} />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(block.sectionKey)} className={styles.deleteButton}>
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      <div className={styles.contentWrapper}>
        {isEditing ? (
          <BlockEditor
            block={block}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <EditableContentRenderer
            contentType={block.contentType}
            content={block.content}
          />
        )}
      </div>
    </div>
  );
};