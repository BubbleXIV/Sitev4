import React, { useState, useEffect } from 'react';
import { useAuth } from '../helpers/useAuth';
import { usePageContentQuery, useUpdatePageContentMutation } from '../helpers/usePageContentQuery';
import { PageContentItem } from '../endpoints/page-content/get_GET.schema';
import { ContentBlock } from './ContentBlock';
import { BlockTypePicker } from './BlockTypePicker';
import { Button } from './Button';
import { Skeleton } from './Skeleton';
import { Save, Loader2 } from 'lucide-react';
import styles from './PageBuilder.module.css';


interface PageBuilderProps {
  pageSlug: string;
  className?: string;
}

export const PageBuilder: React.FC<PageBuilderProps> = ({ pageSlug, className }) => {
  const { authState } = useAuth();
  const { data, isFetching, error } = usePageContentQuery(pageSlug);
  const updateMutation = useUpdatePageContentMutation();

  const [content, setContent] = useState<PageContentItem[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data?.pageContent) {
      // Sort by displayOrder, fallback to array order
      const sortedContent = [...data.pageContent].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      setContent(sortedContent);
      setIsDirty(false);
    }
  }, [data]);

  const handleContentChange = (newContent: PageContentItem[]) => {
    setContent(newContent);
    setIsDirty(true);
  };

  const handleAddBlock = (type: string) => {
    const newBlock: PageContentItem = {
      id: 0, // Temporary ID, backend will assign real one
      sectionKey: `${type}-${Math.random().toString(36).substring(2, 10)}`,
      contentType: type,
      content: '{}', // Default empty content
      pageSlug: pageSlug,
      displayOrder: content.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    handleContentChange([...content, newBlock]);
  };

  const handleUpdateBlock = (sectionKey: string, newBlockContent: string) => {
    const newContent = content.map(block =>
      block.sectionKey === sectionKey ? { ...block, content: newBlockContent } : block
    );
    handleContentChange(newContent);
  };

  const handleDeleteBlock = (sectionKey: string) => {
    const newContent = content.filter(block => block.sectionKey !== sectionKey);
    handleContentChange(newContent);
  };

  const handleSave = () => {
    const contentToSave = content.map((item, index) => ({
      sectionKey: item.sectionKey,
      contentType: item.contentType,
      content: item.content,
      displayOrder: index,
    }));

    updateMutation.mutate(
      { pageSlug, content: contentToSave },
      {
        onSuccess: () => setIsDirty(false),
        onError: (e) => console.error("Failed to save page content:", e),
      }
    );
  };

  if (authState.type !== 'authenticated') {
    return null; // Don't render builder for non-admins
  }

  if (isFetching) {
    return (
      <div className={`${styles.container} ${className || ''}`}>
        <Skeleton style={{ height: '3rem', width: '10rem', marginBottom: 'var(--spacing-4)' }} />
        <Skeleton style={{ height: '20rem', width: '100%' }} />
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorState}>Error loading page content: {error.message}</div>;
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <header className={styles.header}>
        <h2 className={styles.title}>Page Editor</h2>
        <Button onClick={handleSave} disabled={!isDirty || updateMutation.isPending}>
          {updateMutation.isPending ? (
            <>
              <Loader2 className={styles.spinner} /> Saving...
            </>
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </Button>
      </header>

      <div className={styles.contentArea}>
        {content.map(block => (
          <ContentBlock
            key={block.sectionKey}
            block={block}
            onUpdate={handleUpdateBlock}
            onDelete={handleDeleteBlock}
          />
        ))}
      </div>

      <BlockTypePicker onSelectBlock={handleAddBlock} />
    </div>
  );
};