import React from 'react';
import { z } from 'zod';
import { PageContentItem } from '../endpoints/page-content/get_GET.schema';
import { useForm, Form, FormItem, FormLabel, FormControl, FormMessage } from './Form';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Button } from './Button';
import styles from './BlockEditor.module.css';

interface BlockEditorProps {
  block: PageContentItem;
  onSave: (newContent: string) => void;
  onCancel: () => void;
}

// Schemas for different block types
const textBlockSchema = z.object({
  text: z.string().min(1, 'Text content is required.'),
});

const heroBlockSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  subtitle: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
});

type TextBlockData = z.infer<typeof textBlockSchema>;
type HeroBlockData = z.infer<typeof heroBlockSchema>;

const TextEditor: React.FC<{ initialData: TextBlockData, onSave: (data: TextBlockData) => void }> = ({ initialData, onSave }) => {
  const form = useForm({
    schema: textBlockSchema,
    defaultValues: initialData,
  });

  const handleSubmit = (values: TextBlockData) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <FormItem name="text">
          <FormLabel>Content</FormLabel>
          <FormControl>
            <Textarea
              rows={5}
              value={form.values.text || ''}
              onChange={(e) => form.setValues(prev => ({ ...prev, text: e.target.value }))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button type="submit">Save Text</Button>
      </form>
    </Form>
  );
};

const HeroEditor: React.FC<{ initialData: HeroBlockData, onSave: (data: HeroBlockData) => void }> = ({ initialData, onSave }) => {
  const form = useForm({
    schema: heroBlockSchema,
    defaultValues: initialData,
  });

  const handleSubmit = (values: HeroBlockData) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <FormItem name="title">
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input
              value={form.values.title || ''}
              onChange={(e) => form.setValues(prev => ({ ...prev, title: e.target.value }))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem name="subtitle">
          <FormLabel>Subtitle</FormLabel>
          <FormControl>
            <Input
              value={form.values.subtitle || ''}
              onChange={(e) => form.setValues(prev => ({ ...prev, subtitle: e.target.value }))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormItem name="imageUrl">
          <FormLabel>Image URL</FormLabel>
          <FormControl>
            <Input
              value={form.values.imageUrl || ''}
              onChange={(e) => form.setValues(prev => ({ ...prev, imageUrl: e.target.value }))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button type="submit">Save Hero</Button>
      </form>
    </Form>
  );
};


export const BlockEditor: React.FC<BlockEditorProps> = ({ block, onSave, onCancel }) => {
  const safeParseContent = (content: string | null) => {
    try {
      return content ? JSON.parse(content) : {};
    } catch (e) {
      console.error("Failed to parse block content:", e);
      return {};
    }
  };

  const initialData = safeParseContent(block.content);

  const handleSave = (data: object) => {
    onSave(JSON.stringify(data));
  };

  const renderEditor = () => {
    switch (block.contentType) {
      case 'text':
        return <TextEditor initialData={initialData} onSave={handleSave} />;
      case 'hero':
        return <HeroEditor initialData={initialData} onSave={handleSave} />;
      default:
        return <div>Editor for '{block.contentType}' not implemented.</div>;
    }
  };

  return (
    <div className={styles.container}>
      {renderEditor()}
      <Button variant="ghost" onClick={onCancel} className={styles.cancelButton}>
        Cancel
      </Button>
    </div>
  );
};