import React, { useState } from 'react';
import { usePagesQuery, useUpdatePageMutation } from '../helpers/usePagesQuery';
import { Button } from './Button';
import { Badge } from './Badge';
import { Skeleton } from './Skeleton';
import { Eye, EyeOff, ArrowUp, ArrowDown, Navigation, GripVertical } from 'lucide-react';
import styles from './NavigationManagement.module.css';

interface PageItemProps {
  page: any;
  onTogglePublished: (page: any) => void;
  onMoveUp: (page: any) => void;
  onMoveDown: (page: any) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isUpdating: boolean;
}

const PageItem: React.FC<PageItemProps> = ({
  page,
  onTogglePublished,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  isUpdating,
}) => {
  return (
    <div className={styles.pageItem}>
      <div className={styles.dragHandle}>
        <GripVertical size={16} />
      </div>
      
      <div className={styles.pageInfo}>
        <div className={styles.pageHeader}>
          <h4 className={styles.pageTitle}>{page.title}</h4>
          <div className={styles.pageBadges}>
            <Badge variant={page.isPublished ? "success" : "outline"}>
              {page.isPublished ? (
                <>
                  <Eye size={12} />
                  Published
                </>
              ) : (
                <>
                  <EyeOff size={12} />
                  Draft
                </>
              )}
            </Badge>
            {page.displayOrder && (
              <Badge variant="outline">#{page.displayOrder}</Badge>
            )}
          </div>
        </div>
        
        <div className={styles.pageDetails}>
          <span className={styles.pageSlug}>/{page.slug}</span>
          <span className={styles.pageDate}>
            Updated: {new Date(page.updatedAt || page.createdAt || new Date()).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className={styles.pageActions}>
        <div className={styles.orderControls}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onMoveUp(page)}
            disabled={!canMoveUp || isUpdating}
            title="Move up"
          >
            <ArrowUp size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onMoveDown(page)}
            disabled={!canMoveDown || isUpdating}
            title="Move down"
          >
            <ArrowDown size={16} />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTogglePublished(page)}
          disabled={isUpdating}
        >
          {page.isPublished ? (
            <>
              <EyeOff size={16} />
              Unpublish
            </>
          ) : (
            <>
              <Eye size={16} />
              Publish
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export const NavigationManagement: React.FC = () => {
  const { data: pagesData, isFetching, error } = usePagesQuery();
  const updatePageMutation = useUpdatePageMutation();

  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const togglePublished = async (page: any) => {
    try {
      await updatePageMutation.mutateAsync({
        id: page.id,
        title: page.title,
        slug: page.slug,
        isPublished: !page.isPublished,
        displayOrder: page.displayOrder || undefined,
        content: page.content,
      });
    } catch (error) {
      console.error("Failed to toggle page status:", error);
    }
  };

  const updatePageOrder = async (page: any, newOrder: number) => {
    try {
      await updatePageMutation.mutateAsync({
        id: page.id,
        title: page.title,
        slug: page.slug,
        isPublished: page.isPublished,
        displayOrder: newOrder,
        content: page.content,
      });
    } catch (error) {
      console.error("Failed to update page order:", error);
    }
  };

  const movePageUp = (page: any) => {
    if (!page.displayOrder) return;
    updatePageOrder(page, page.displayOrder - 1);
  };

  const movePageDown = (page: any) => {
    const currentOrder = page.displayOrder || 0;
    updatePageOrder(page, currentOrder + 1);
  };

  const bulkPublish = async (publish: boolean) => {
    const pages = pagesData?.pages ?? [];
    const filteredPages = pages.filter(page => page.isPublished !== publish);
    
    try {
      await Promise.all(
        filteredPages.map(page =>
          updatePageMutation.mutateAsync({
            id: page.id,
            title: page.title,
            slug: page.slug,
            isPublished: publish,
            displayOrder: page.displayOrder || undefined,
            content: page.content,
          })
        )
      );
    } catch (error) {
      console.error("Failed to bulk update pages:", error);
    }
  };

  if (isFetching) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingList}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.pageItemSkeleton}>
              <Skeleton style={{ width: '16px', height: '16px' }} />
              <div className={styles.pageInfoSkeleton}>
                <Skeleton style={{ width: '200px', height: '1.25rem' }} />
                <Skeleton style={{ width: '150px', height: '1rem' }} />
              </div>
              <Skeleton style={{ width: '100px', height: '2rem' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading pages: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  const pages = pagesData?.pages ?? [];
  
  // Sort pages by display order, then by title
  const sortedPages = [...pages].sort((a, b) => {
    if (a.displayOrder && b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    if (a.displayOrder) return -1;
    if (b.displayOrder) return 1;
    return a.title.localeCompare(b.title);
  });

  // Filter pages based on selected filter
  const filteredPages = sortedPages.filter(page => {
    if (filter === 'published') return page.isPublished;
    if (filter === 'draft') return !page.isPublished;
    return true;
  });

  const publishedCount = pages.filter(p => p.isPublished).length;
  const draftCount = pages.filter(p => !p.isPublished).length;

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div className={styles.filterTabs}>
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Pages ({pages.length})
          </Button>
          <Button
            variant={filter === 'published' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('published')}
          >
            <Eye size={16} />
            Published ({publishedCount})
          </Button>
          <Button
            variant={filter === 'draft' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('draft')}
          >
            <EyeOff size={16} />
            Drafts ({draftCount})
          </Button>
        </div>

        <div className={styles.bulkActions}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => bulkPublish(true)}
            disabled={updatePageMutation.isPending || publishedCount === pages.length}
          >
            Publish All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => bulkPublish(false)}
            disabled={updatePageMutation.isPending || draftCount === pages.length}
          >
            Unpublish All
          </Button>
        </div>
      </div>

      <div className={styles.pagesList}>
        {filteredPages.length > 0 ? (
          filteredPages.map((page, index) => (
            <PageItem
              key={page.id}
              page={page}
              onTogglePublished={togglePublished}
              onMoveUp={movePageUp}
              onMoveDown={movePageDown}
              canMoveUp={index > 0 && !!page.displayOrder}
              canMoveDown={index < filteredPages.length - 1}
              isUpdating={updatePageMutation.isPending}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <Navigation size={48} />
            <h3>
              {filter === 'published' && 'No published pages'}
              {filter === 'draft' && 'No draft pages'}
              {filter === 'all' && 'No pages found'}
            </h3>
            <p>
              {filter === 'published' && 'Publish some pages to see them here.'}
              {filter === 'draft' && 'Create some draft pages to see them here.'}
              {filter === 'all' && 'Create your first page to get started.'}
            </p>
          </div>
        )}
      </div>

      {filteredPages.length > 0 && (
        <div className={styles.helpText}>
          <p>
            <strong>Tip:</strong> Use the arrow buttons to reorder pages. Pages with display orders will appear first in navigation.
            Published pages are visible to visitors, while draft pages are only visible to admins.
          </p>
        </div>
      )}
    </div>
  );
};