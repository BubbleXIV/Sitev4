import React, { useState } from 'react';
import { Database } from '../types/supabase';
import { usePageContentQuery, useUpdatePageContentMutation } from '../helpers/useSupabaseQuery';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { Form, useForm, FormItem, FormLabel, FormControl, FormMessage } from './Form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './Dialog';
import { Badge } from './Badge';
import { Skeleton } from './Skeleton';
import { Search, Edit, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';
import styles from './PageContentManagement.module.css';

const pageContentSchema = z.object({
  pageSlug: z.string().min(1, "Page slug is required"),
  content: z.array(z.object({
    sectionKey: z.string().min(1, "Section key is required"),
    contentType: z.string().min(1, "Content type is required"),
    content: z.string().nullable(),
  })),
});

type PageContentFormValues = z.infer<typeof pageContentSchema>;

const AVAILABLE_PAGES = [
  { slug: 'home', name: 'Home Page' },
  { slug: 'about', name: 'About Us' },
  { slug: 'menu', name: 'Menu' },
  { slug: 'events', name: 'Events' },
  { slug: 'contact', name: 'Contact' },
];

const CONTENT_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'html', label: 'HTML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'image_url', label: 'Image URL' },
];

export const PageContentManagement: React.FC = () => {
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>('');
  const [editingContent, setEditingContent] = useState<any>(null);
  
  const { data: pageContentData, isFetching, error } = usePageContentQuery();
  const updateContentMutation = useUpdatePageContentMutation();

  const form = useForm({
    schema: pageContentSchema,
    defaultValues: {
      pageSlug: '',
      content: [],
    },
  });

  React.useEffect(() => {
    if (pageContentData && selectedPageSlug) {
      const pageContent = pageContentData.content.filter(item => item.page === selectedPageSlug);
      form.setValues({
        pageSlug: selectedPageSlug,
        content: pageContent.map(item => ({
          sectionKey: item.section,
          contentType: 'text', // Default type
          content: typeof item.content === 'string' ? item.content : JSON.stringify(item.content),
        })),
      });
    }
  }, [pageContentData, selectedPageSlug]);

  const handlePageSelect = (pageSlug: string) => {
    setSelectedPageSlug(pageSlug);
  };

  const handleSubmit = async (values: PageContentFormValues) => {
    try {
      for (const section of values.content) {
        await updateContentMutation.mutateAsync({
          page: values.pageSlug,
          section: section.sectionKey,
          content: section.content || ''
        });
      }
      setEditingContent(null);
    } catch (error) {
      console.error("Failed to update page content:", error);
    }
  };

  const addContentSection = () => {
    const newSection = {
      sectionKey: `section_${Date.now()}`,
      contentType: 'text',
      content: '',
    };
    
    form.setValues(prev => ({
      ...prev,
      content: [...prev.content, newSection],
    }));
  };

  const removeContentSection = (index: number) => {
    form.setValues(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  };

  const updateContentSection = (index: number, field: string, value: any) => {
    form.setValues(prev => ({
      ...prev,
      content: prev.content.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  if (!selectedPageSlug) {
    return (
      <div className={styles.container}>
        <div className={styles.pageSelector}>
          <h3>Select a page to edit its content:</h3>
          <div className={styles.pageGrid}>
            {AVAILABLE_PAGES.map(page => (
              <Button
                key={page.slug}
                variant="outline"
                onClick={() => handlePageSelect(page.slug)}
                className={styles.pageButton}
              >
                <Edit size={16} />
                {page.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const selectedPage = AVAILABLE_PAGES.find(p => p.slug === selectedPageSlug);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h3>Editing: {selectedPage?.name}</h3>
          <Badge variant="outline">{selectedPageSlug}</Badge>
        </div>
        <Button
          variant="ghost"
          onClick={() => setSelectedPageSlug('')}
        >
          ← Back to Page Selection
        </Button>
      </div>

      {isFetching ? (
        <div className={styles.loading}>
          <Skeleton style={{ width: '100%', height: '200px' }} />
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>Error loading page content: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
            <div className={styles.contentSections}>
              <div className={styles.sectionHeader}>
                <h4>Content Sections</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addContentSection}
                >
                  <Plus size={16} />
                  Add Section
                </Button>
              </div>

              {form.values.content.map((section, index) => (
                <div key={index} className={styles.contentSection}>
                  <div className={styles.sectionControls}>
                    <FormItem name={`content.${index}.sectionKey`}>
                      <FormLabel>Section Key</FormLabel>
                      <FormControl>
                        <Input
                          value={section.sectionKey}
                          onChange={(e) => updateContentSection(index, 'sectionKey', e.target.value)}
                          placeholder="e.g., hero_title, about_description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <FormItem name={`content.${index}.contentType`}>
                      <FormLabel>Content Type</FormLabel>
                      <FormControl>
                        <Select
                          value={section.contentType}
                          onValueChange={(value) => updateContentSection(index, 'contentType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTENT_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeContentSection(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <FormItem name={`content.${index}.content`}>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        value={section.content || ''}
                        onChange={(e) => updateContentSection(index, 'content', e.target.value)}
                        placeholder="Enter your content here..."
                        rows={section.contentType === 'html' || section.contentType === 'markdown' ? 8 : 4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              ))}

              {form.values.content.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No content sections yet. Add a section to get started.</p>
                </div>
              )}
            </div>

            <div className={styles.formActions}>
              <Button
                type="submit"
                disabled={updateContentMutation.isPending}
              >
                {updateContentMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
