import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Badge } from './Badge';
import { Skeleton } from './Skeleton';
import { useImagesQuery, useUploadImageMutation, useDeleteImageMutation } from '../helpers/useSupabaseQuery';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Copy, 
  Download, 
  Search,
  Grid,
  List,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './ImageLibrary.module.css';

interface ImageItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export const ImageLibrary: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: imagesData, isFetching, error } = useImagesQuery();
  const uploadMutation = useUploadImageMutation();
  const deleteMutation = useDeleteImageMutation();

  const images = imagesData?.images || [];

  // Filter images based on search term
  const filteredImages = images.filter(image =>
    image.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        continue;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
        continue;
      }

      setUploadingFiles(prev => [...prev, file.name]);

      const formData = new FormData();
      formData.append('image', file);

      try {
        await uploadMutation.mutateAsync(formData);
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
        console.error('Upload error:', error);
      } finally {
        setUploadingFiles(prev => prev.filter(name => name !== file.name));
      }
    }

    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (imageId: number, filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(imageId);
      toast.success(`${filename} deleted successfully`);
      setSelectedImages(prev => prev.filter(id => id !== imageId));
    } catch (error) {
      toast.error(`Failed to delete ${filename}`);
      console.error('Delete error:', error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedImages.length} selected images? This action cannot be undone.`)) {
      return;
    }

    for (const imageId of selectedImages) {
      try {
        await deleteMutation.mutateAsync(imageId);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }

    toast.success(`${selectedImages.length} images deleted successfully`);
    setSelectedImages([]);
  };

  const copyImageUrl = (url: string, filename: string) => {
    navigator.clipboard.writeText(url);
    toast.success(`URL for ${filename} copied to clipboard`);
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const toggleImageSelection = (imageId: number) => {
    setSelectedImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderUploadArea = () => (
    <div className={styles.uploadArea}>
      <div className={styles.uploadHeader}>
        <h3>Upload Images</h3>
        <p>Drag and drop images here or click to browse</p>
      </div>
      
      <div 
        className={styles.uploadZone}
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          const files = Array.from(e.dataTransfer.files);
          if (fileInputRef.current) {
            // Create a new FileList-like object
            const dt = new DataTransfer();
            files.forEach(file => dt.items.add(file));
            fileInputRef.current.files = dt.files;
            handleFileUpload({ target: { files: dt.files } } as any);
          }
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload size={48} className={styles.uploadIcon} />
        <p>Click to upload or drag and drop</p>
        <p className={styles.uploadHint}>
          Supports JPG, PNG, GIF, WebP up to 10MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {uploadingFiles.length > 0 && (
        <div className={styles.uploadProgress}>
          <h4>Uploading Files:</h4>
          {uploadingFiles.map(filename => (
            <div key={filename} className={styles.uploadingFile}>
              <Loader2 size={16} className={styles.spinner} />
              <span>{filename}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderToolbar = () => (
    <div className={styles.toolbar}>
      <div className={styles.searchSection}>
        <div className={styles.searchInput}>
          <Search size={16} />
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className={styles.clearSearch}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className={styles.toolbarActions}>
        {selectedImages.length > 0 && (
          <>
            <Badge variant="secondary" className={styles.selectionCount}>
              {selectedImages.length} selected
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeleteSelected}
              disabled={deleteMutation.isPending}
            >
              <Trash2 size={14} /> Delete Selected
            </Button>
          </>
        )}

        <div className={styles.viewToggle}>
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={14} />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => setViewMode('list')}
          >
            <List size={14} />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderImageCard = (image: ImageItem) => (
    <Card 
      key={image.id} 
      className={`${styles.imageCard} ${selectedImages.includes(image.id) ? styles.selected : ''}`}
    >
      <div className={styles.imagePreview}>
        <img
          src={image.url}
          alt={image.originalName}
          className={styles.previewImage}
        />
        <div className={styles.imageOverlay}>
          <div className={styles.imageActions}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => copyImageUrl(image.url, image.originalName)}
            >
              <Copy size={14} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => downloadImage(image.url, image.originalName)}
            >
              <Download size={14} />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteImage(image.id, image.originalName)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 size={14} />
            </Button>
          </div>
          <div className={styles.selectionCheckbox}>
            <input
              type="checkbox"
              checked={selectedImages.includes(image.id)}
              onChange={() => toggleImageSelection(image.id)}
            />
          </div>
        </div>
      </div>
      <CardContent className={styles.imageInfo}>
        <p className={styles.imageName} title={image.originalName}>
          {image.originalName}
        </p>
        <div className={styles.imageMetadata}>
          <span className={styles.fileSize}>{formatFileSize(image.size)}</span>
          <span className={styles.uploadDate}>{formatDate(image.createdAt)}</span>
        </div>
        <div className={styles.imageUrl}>
          <Input
            value={image.url}
            readOnly
            onClick={(e) => e.currentTarget.select()}
            className={styles.urlInput}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderListItem = (image: ImageItem) => (
    <div key={image.id} className={`${styles.listItem} ${selectedImages.includes(image.id) ? styles.selected : ''}`}>
      <div className={styles.listItemCheckbox}>
        <input
          type="checkbox"
          checked={selectedImages.includes(image.id)}
          onChange={() => toggleImageSelection(image.id)}
        />
      </div>
      <div className={styles.listItemPreview}>
        <img src={image.url} alt={image.originalName} />
      </div>
      <div className={styles.listItemInfo}>
        <p className={styles.listItemName}>{image.originalName}</p>
        <p className={styles.listItemMeta}>
          {formatFileSize(image.size)} • {formatDate(image.createdAt)}
        </p>
      </div>
      <div className={styles.listItemUrl}>
        <Input
          value={image.url}
          readOnly
          onClick={(e) => e.currentTarget.select()}
        />
      </div>
      <div className={styles.listItemActions}>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => copyImageUrl(image.url, image.originalName)}
        >
          <Copy size={14} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => downloadImage(image.url, image.originalName)}
        >
          <Download size={14} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleDeleteImage(image.id, image.originalName)}
          disabled={deleteMutation.isPending}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className={styles.errorState}>
        <AlertCircle size={48} />
        <h3>Failed to load images</h3>
        <p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
      </div>
    );
  }

  return (
    <div className={styles.imageLibrary}>
      {renderUploadArea()}
      
      <div className={styles.librarySection}>
        <div className={styles.libraryHeader}>
          <h3>Image Library</h3>
          <p>{filteredImages.length} of {images.length} images</p>
        </div>

        {renderToolbar()}

        {isFetching ? (
          <div className={`${styles.imagesContainer} ${styles[viewMode]}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className={styles.skeletonCard}>
                <Skeleton className={styles.skeletonImage} />
                <CardContent>
                  <Skeleton style={{ height: '1rem', width: '80%', marginBottom: '0.5rem' }} />
                  <Skeleton style={{ height: '0.75rem', width: '60%' }} />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className={styles.emptyState}>
            <ImageIcon size={48} />
            <h3>{searchTerm ? 'No images found' : 'No images uploaded yet'}</h3>
            <p>
              {searchTerm 
                ? `No images match "${searchTerm}"`
                : 'Upload your first image to get started'
              }
            </p>
          </div>
        ) : (
          <div className={`${styles.imagesContainer} ${styles[viewMode]}`}>
            {viewMode === 'grid' 
              ? filteredImages.map(renderImageCard)
              : filteredImages.map(renderListItem)
            }
          </div>
        )}
      </div>
    </div>
  );
};
