import React, { useState } from 'react';
import { useImagesQuery, useUploadImageMutation, useDeleteImageMutation } from '../helpers/useImageQuery';
import { Button } from './Button';
import { Input } from './Input';
import { Form, useForm, FormItem, FormLabel, FormControl, FormMessage } from './Form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './Dialog';
import { Badge } from './Badge';
import { Skeleton } from './Skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import { Upload, Link as LinkIcon, Trash2, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { z } from 'zod';
import styles from './ImageLibrary.module.css';

const fileUploadSchema = z.object({
  source: z.literal("upload"),
  file: z.instanceof(File, { message: "Image is required." }),
  altText: z.string().optional(),
});

const urlUploadSchema = z.object({
  source: z.literal("url"),
  url: z.string().url("Please enter a valid URL."),
  altText: z.string().optional(),
});

const uploadSchema = z.discriminatedUnion("source", [
  fileUploadSchema,
  urlUploadSchema,
]);

type UploadFormValues = z.infer<typeof uploadSchema>;

interface UploadFormProps {
  onClose: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onClose }) => {
  const [uploadType, setUploadType] = useState<'upload' | 'url'>('upload');
  const uploadMutation = useUploadImageMutation();

  const form = useForm({
    schema: uploadSchema,
    defaultValues: uploadType === 'upload' 
      ? { source: 'upload' as const, file: undefined as any, altText: '' }
      : { source: 'url' as const, url: '', altText: '' },
  });

  const handleSubmit = async (values: UploadFormValues) => {
    try {
      const formData = new FormData();
      formData.append('source', values.source);
      
      if (values.source === 'upload' && values.file) {
        formData.append('file', values.file);
      } else if (values.source === 'url' && values.url) {
        formData.append('url', values.url);
      }
      
      if (values.altText) {
        formData.append('altText', values.altText);
      }

      await uploadMutation.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValues(prev => ({ ...prev, file }));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        
        <Tabs value={uploadType} onValueChange={(value) => {
          const newType = value as 'upload' | 'url';
          setUploadType(newType);
          // Reset form with proper structure for the new type
          if (newType === 'upload') {
            form.setValues({ source: 'upload' as const, file: undefined as any, altText: form.values.altText || '' });
          } else {
            form.setValues({ source: 'url' as const, url: '', altText: form.values.altText || '' });
          }
        }}>
          <TabsList>
            <TabsTrigger value="upload">
              <Upload size={16} />
              File Upload
            </TabsTrigger>
            <TabsTrigger value="url">
              <LinkIcon size={16} />
              URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className={styles.formFields}>
              <FormItem name="file">
                <FormLabel>Select Image File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          </TabsContent>

          <TabsContent value="url">
            <div className={styles.formFields}>
              <FormItem name="url">
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={form.values.source === 'url' ? form.values.url || '' : ''}
                    onChange={(e) => {
                      if (form.values.source === 'url') {
                        form.setValues({ ...form.values, url: e.target.value });
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          </TabsContent>
        </Tabs>

        <div className={styles.formFields}>
          <FormItem name="altText">
            <FormLabel>Alt Text (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Describe the image for accessibility"
                value={form.values.altText || ''}
                onChange={(e) => form.setValues(prev => ({ ...prev, altText: e.target.value }))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? 'Uploading...' : 'Upload Image'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

interface ImageCardProps {
  image: any;
  onDelete: (image: any) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(image.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.imageCard}>
      <div className={styles.imagePreview}>
        <img src={image.url} alt={image.altText || image.filename} />
      </div>
      
      <div className={styles.imageInfo}>
        <h4 className={styles.imageName}>{image.filename}</h4>
        {image.altText && (
          <p className={styles.imageAlt}>{image.altText}</p>
        )}
        
        <div className={styles.imageMeta}>
          {image.mimeType && <Badge variant="outline">{image.mimeType}</Badge>}
          {image.sizeBytes && <Badge variant="outline">{formatFileSize(image.sizeBytes)}</Badge>}
        </div>
        
        <div className={styles.imageActions}>
          <Button
            variant="outline"
            size="sm"
            onClick={copyUrl}
            className={styles.copyButton}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy URL'}
          </Button>
          
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(image)}
            className={styles.deleteButton}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ImageLibrary: React.FC = () => {
  const { data: imagesData, isFetching, error } = useImagesQuery();
  const deleteMutation = useDeleteImageMutation();

  const [uploadDialog, setUploadDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<any>(null);

  const handleDelete = async () => {
    if (!deleteDialog) return;
    try {
      await deleteMutation.mutateAsync({ id: deleteDialog.id });
      setDeleteDialog(null);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  if (isFetching) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingGrid}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} style={{ width: '100%', height: '200px', borderRadius: 'var(--radius)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading images: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  const images = imagesData?.images ?? [];

  return (
    <div className={styles.container}>
      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
        <DialogTrigger asChild>
          <Button>
            <Upload size={16} />
            Upload Image
          </Button>
        </DialogTrigger>
        <DialogContent>
          <UploadForm onClose={() => setUploadDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={(open) => !open && setDeleteDialog(null)}>
        {deleteDialog && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Image?</DialogTitle>
            </DialogHeader>
            <div className={styles.deletePreview}>
              <img src={deleteDialog.url} alt={deleteDialog.filename} />
              <div>
                <p><strong>{deleteDialog.filename}</strong></p>
                <p>Are you sure you want to delete this image? This action cannot be undone.</p>
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
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <div className={styles.imageGrid}>
        {images.length > 0 ? (
          images.map(image => (
            <ImageCard
              key={image.id}
              image={image}
              onDelete={setDeleteDialog}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <ImageIcon size={48} />
            <h3>No images uploaded yet</h3>
            <p>Upload your first image to get started with the image library.</p>
          </div>
        )}
      </div>
    </div>
  );
};