import React, { useState } from 'react';
import { usePagesQuery, useCreatePageMutation, useUpdatePageMutation, useDeletePageMutation } from '../helpers/usePagesQuery';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Checkbox } from './Checkbox';
import { Form, useForm, FormItem, FormLabel, FormControl, FormMessage } from './Form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './Dialog';
import { Badge } from './Badge';
import { Skeleton } from './Skeleton';
import { FileText, Plus, Edit, Trash2, Eye, EyeOff, Calendar } from 'lucide-react';
import { z } from 'zod';
import styles from './DynamicPagesManagement.module.css';

const pageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and contain only letters, numbers, and hyphens"
    ),
  isPublished: z.boolean().optional(),
  displayOrder: z.number().optional(),
  content: z.string().nullable().optional(),
});

type PageFormValues = z.infer<typeof pageSchema>;

interface PageFormProps {
  page?: any;
  onClose: () => void;
}

const PageForm: React.FC<PageFormProps> = ({ page, onClose }) => {
  const isEditing = !!page;
  const createPageMutation = useCreatePageMutation();
  const updatePageMutation = useUpdatePageMutation();

  const form = useForm({
    schema: pageSchema,
    defaultValues: {
      title: page?.title ?? '',
      slug: page?.slug ?? '',
      isPublished: page?.isPublished ?? false,
      displayOrder: page?.displayOrder ?? undefined,
      content: page?.content ?? '',
    },
  });

  const handleSubmit = async (values: PageFormValues) => {
    try {
      if (isEditing) {
        await updatePageMutation.mutateAsync({ id: page.id, ...values });
      } else {
        await createPageMutation.mutateAsync(values);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save page:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      form.setFieldError('title', `Save failed: ${errorMessage}`);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    form.setValues(prev => ({ ...prev, title }));
    if (!isEditing || !form.values.slug) {
      form.setValues(prev => ({ ...prev, slug: generateSlug(title) }));
    }
  };

  const isMutating = createPageMutation.isPending || updatePageMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Page' : 'Create New Page'}</DialogTitle>
        </DialogHeader>
        
        <div className={styles.formFields}>
          <FormItem name="title">
            <FormLabel>Page Title</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., About Us, Services, Contact"
                value={form.values.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem name="slug">
            <FormLabel>URL Slug</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., about-us, services, contact"
                value={form.values.slug}
                onChange={(e) => form.setValues(prev => ({ ...prev, slug: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem name="content">
            <FormLabel>Page Content (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter the page content..."
                value={form.values.content ?? ''}
                onChange={(e) => form.setValues(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <div className={styles.formRow}>
            <FormItem name="displayOrder">
              <FormLabel>Display Order (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1, 2, 3..."
                  value={form.values.displayOrder?.toString() ?? ''}
                  onChange={(e) => form.setValues(prev => ({ 
                    ...prev, 
                    displayOrder: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem name="isPublished">
              <FormLabel>Published</FormLabel>
              <FormControl>
                <div className={styles.checkboxWrapper}>
                  <Checkbox
                    checked={form.values.isPublished}
                    onChange={(e) => form.setValues(prev => ({ ...prev, isPublished: e.target.checked }))}
                  />
                  <span>Make this page publicly visible</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isMutating}>
            {isMutating ? 'Saving...' : (isEditing ? 'Update Page' : 'Create Page')}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export const DynamicPagesManagement: React.FC = () => {
  const { data: pagesData, isFetching, error } = usePagesQuery();
  const deletePageMutation = useDeletePageMutation();
  const updatePageMutation = useUpdatePageMutation();

  const [pageDialog, setPageDialog] = useState<{ type: 'add' | 'edit' | null; data?: any }>({ type: null });
  const [deleteDialog, setDeleteDialog] = useState<any>(null);

  const handleDelete = async () => {
    if (!deleteDialog) return;
    try {
      await deletePageMutation.mutateAsync({ id: deleteDialog.id });
      setDeleteDialog(null);
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  const togglePublished = async (page: any) => {
    try {
      await updatePageMutation.mutateAsync({
        id: page.id,
        title: page.title,
        slug: page.slug,
        isPublished: !page.isPublished,
        displayOrder: page.displayOrder,
        content: page.content,
      });
    } catch (error) {
      console.error("Failed to toggle page status:", error);
    }
  };

  if (isFetching) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingList}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.pageCardSkeleton}>
              <div className={styles.pageInfoSkeleton}>
                <Skeleton style={{ width: '200px', height: '1.5rem' }} />
                <Skeleton style={{ width: '150px', height: '1rem' }} />
                <Skeleton style={{ width: '300px', height: '1rem' }} />
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
  const sortedPages = [...pages].sort((a, b) => {
    if (a.displayOrder && b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    if (a.displayOrder) return -1;
    if (b.displayOrder) return 1;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className={styles.container}>
      {/* Page Dialog */}
      <Dialog open={!!pageDialog.type} onOpenChange={(open) => !open && setPageDialog({ type: null })}>
        <DialogTrigger asChild>
          <Button onClick={() => setPageDialog({ type: 'add' })}>
            <Plus size={16} />
            Create Page
          </Button>
        </DialogTrigger>
        {pageDialog.type && (
          <DialogContent>
            <PageForm
              page={pageDialog.type === 'edit' ? pageDialog.data : undefined}
              onClose={() => setPageDialog({ type: null })}
            />
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        {deleteDialog && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Page?</DialogTitle>
            </DialogHeader>
            <div className={styles.deletePreview}>
              <div>
                <p><strong>{deleteDialog.title}</strong></p>
                <p>Slug: /{deleteDialog.slug}</p>
                <p>Are you sure you want to delete this page? This action cannot be undone.</p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="ghost" 
                onClick={() => setDeleteDialog(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deletePageMutation.isPending}
              >
                {deletePageMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <div className={styles.pagesList}>
        {sortedPages.length > 0 ? (
          sortedPages.map(page => (
            <div key={page.id} className={styles.pageCard}>
              <div className={styles.pageInfo}>
                <div className={styles.pageHeader}>
                  <h3 className={styles.pageTitle}>{page.title}</h3>
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
                      <Badge variant="outline">Order: {page.displayOrder}</Badge>
                    )}
                  </div>
                </div>
                
                <div className={styles.pageDetails}>
                  <div className={styles.pageSlug}>
                    <span>URL: /{page.slug}</span>
                  </div>
                  {page.content && (
                    <div className={styles.pageContent}>
                      {page.content.length > 100 
                        ? `${page.content.substring(0, 100)}...` 
                        : page.content
                      }
                    </div>
                  )}
                  <div className={styles.pageDates}>
                    {page.createdAt && (
                      <span>
                        <Calendar size={12} />
                        Created: {new Date(page.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    {page.updatedAt && page.updatedAt !== page.createdAt && (
                      <span>
                        Updated: {new Date(page.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.pageActions}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePublished(page)}
                  disabled={updatePageMutation.isPending}
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
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setPageDialog({ type: 'edit', data: page })}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeleteDialog(page)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <FileText size={48} />
            <h3>No pages created yet</h3>
            <p>Create your first dynamic page to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};