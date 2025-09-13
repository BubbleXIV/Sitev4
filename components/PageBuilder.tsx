import React, { useState, useEffect } from 'react';
import { useAuth } from '../helpers/useAuth';
import { Database } from '../types/supabase';
import { usePageContentQuery, useUpdatePageContentMutation } from '../helpers/useSupabaseQuery';
import { ContentBlock } from './ContentBlock';
import BlockTypePicker from './BlockTypePicker';
import { Button } from './Button';
import { Skeleton } from './Skeleton';
import { Save, Loader2 } from 'lucide-react';
import styles from './PageBuilder.module.css';

// Define the page content item type based on Supabase
type PageContentItem = Database['public']['Tables']['page_content']['Row'] & {
  sectionKey: string;
  contentType: string;
  displayOrder?: number;
};

// Convert to the format expected by ContentBlock
type ContentBlockItem = {
  sectionKey: string;
  contentType: string;
  content: string;
};

interface PageBuilderProps {
  pageSlug: string;
  className?: string;
}

export const PageBuilder: React.FC<PageBuilderProps> = ({ pageSlug, className }) => {
  const { authState } = useAuth();
  const { data, isFetching, error } = usePageContentQuery();
  const updateMutation = useUpdatePageContentMutation();

  const [content, setContent] = useState<ContentBlockItem[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (data?.content) {
      // Filter content for this page and convert to expected format
      const pageContent = data.content
        .filter(item => item.page === pageSlug)
        .map(item => ({
          sectionKey: item.section,
          contentType: 'text', // Default type, could be stored in content
          content: typeof item.content === 'string' ? item.content : JSON.stringify(item.content)
        }));
      
      setContent(pageContent);
      setIsDirty(false);
    }
  }, [data, pageSlug]);

  const handleContentChange = (newContent: ContentBlockItem[]) => {
    setContent(newContent);
    setIsDirty(true);
  };

  const handleAddBlock = (type: string) => {
    const newBlock: ContentBlockItem = {
      sectionKey: `${type}-${Math.random().toString(36).substring(2, 10)}`,
      contentType: type,
      content: '{}', // Default empty content
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

  const handleSave = async () => {
    try {
      // Save each content block
      for (const block of content) {
        await updateMutation.mutateAsync({
          page: pageSlug,
          section: block.sectionKey,
          content: block.content
        });
      }
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to save page content:", error);
    }
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
    return <div className={styles.errorState}>Error loading page content: {error instanceof Error ? error.message : 'Unknown error'}</div>;
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <header className={styles.header}>
        <h2 className={styles.title}>Page Editor: {pageSlug}</h2>
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
        
        {content.length === 0 && (
          <div className={styles.emptyState}>
            <p>No content blocks yet. Add your first block to get started!</p>
          </div>
        )}
      </div>

      <BlockTypePicker onSelectBlock={handleAddBlock} />
    </div>
  );
};
