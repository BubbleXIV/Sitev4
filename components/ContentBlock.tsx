import React, { useState, useRef } from 'react';
import { Database } from '../types/supabase';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Badge } from './Badge';
import { Separator } from './Separator';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';
import { Form, useForm, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from './Form';
import { 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  Image as ImageIcon, 
  Minus, 
  CreditCard, 
  MousePointer, 
  Upload,
  Eye,
  EyeOff 
} from 'lucide-react';
import styles from './ContentBlock.module.css';

// Assuming your page content structure from the database
type PageContentItem = {
  id: number;
  page: string;
  section: string;
  content: any;
};

interface ContentBlockProps {
  block: {
    sectionKey: string;
    contentType: string;
    content: string;
  };
  onUpdate: (sectionKey: string, content: string) => void;
  onDelete: (sectionKey: string) => void;
}

interface BlockContent {
  text?: string;
  html?: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  cardTitle?: string;
  cardDescription?: string;
  cardImage?: string;
  heading?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  style?: 'default' | 'primary' | 'secondary' | 'accent';
  alignment?: 'left' | 'center' | 'right';
}

export const ContentBlock: React.FC<ContentBlockProps> = ({ block, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<BlockContent>(() => {
    try {
      return JSON.parse(block.content || '{}');
    } catch {
      return {};
    }
  });
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate(block.sectionKey, JSON.stringify(editContent));
    setIsEditing(false);
  };

  const handleCancel = () => {
    try {
      setEditContent(JSON.parse(block.content || '{}'));
    } catch {
      setEditContent({});
    }
    setIsEditing(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('image', file);

    try {
      // This would call your image upload endpoint
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setEditContent(prev => ({ ...prev, imageUrl: data.imageUrl }));
      } else {
        console.error('Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  const renderEditForm = () => {
    switch (block.contentType) {
      case 'text':
        return (
          <div className={styles.editForm}>
            <Textarea
              value={editContent.text || ''}
              onChange={(e) => setEditContent(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Enter your text content..."
              rows={4}
            />
            <div className={styles.styleOptions}>
              <Select value={editContent.alignment || 'left'} onValueChange={(value) => 
                setEditContent(prev => ({ ...prev, alignment: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Text Alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'heading':
        return (
          <div className={styles.editForm}>
            <Input
              value={editContent.heading || ''}
              onChange={(e) => setEditContent(prev => ({ ...prev, heading: e.target.value }))}
              placeholder="Enter heading text..."
            />
            <div className={styles.styleOptions}>
              <Select value={editContent.headingLevel || 'h2'} onValueChange={(value) => 
                setEditContent(prev => ({ ...prev, headingLevel: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Heading Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1 - Large Heading</SelectItem>
                  <SelectItem value="h2">H2 - Section Heading</SelectItem>
                  <SelectItem value="h3">H3 - Subsection</SelectItem>
                  <SelectItem value="h4">H4 - Small Heading</SelectItem>
                </SelectContent>
              </Select>
              <Select value={editContent.alignment || 'left'} onValueChange={(value) => 
                setEditContent(prev => ({ ...prev, alignment: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className={styles.editForm}>
            <div className={styles.imageUploadSection}>
              <Input
                value={editContent.imageUrl || ''}
                onChange={(e) => setEditContent(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="Enter image URL or upload a file..."
              />
              <div className={styles.uploadActions}>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={16} /> Browse
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <Input
              value={editContent.title || ''}
              onChange={(e) => setEditContent(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Image caption (optional)..."
            />
            <div className={styles.styleOptions}>
              <Select value={editContent.alignment || 'center'} onValueChange={(value) => 
                setEditContent(prev => ({ ...prev, alignment: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Image Alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editContent.imageUrl && (
              <div className={styles.imagePreview}>
                <img src={editContent.imageUrl} alt="Preview" />
              </div>
            )}
          </div>
        );

      case 'card':
        return (
          <div className={styles.editForm}>
            <Input
              value={editContent.cardTitle || ''}
              onChange={(e) => setEditContent(prev => ({ ...prev, cardTitle: e.target.value }))}
              placeholder="Card title..."
            />
            <Textarea
              value={editContent.cardDescription || ''}
              onChange={(e) => setEditContent(prev => ({ ...prev, cardDescription: e.target.value }))}
              placeholder="Card description..."
              rows={3}
            />
            <div className={styles.imageUploadSection}>
              <Input
                value={editContent.cardImage || ''}
                onChange={(e) => setEditContent(prev => ({ ...prev, cardImage: e.target.value }))}
                placeholder="Card image URL (optional)..."
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload size={16} /> Browse
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
            <div className={styles.styleOptions}>
              <Select value={editContent.style || 'default'} onValueChange={(value) => 
                setEditContent(prev => ({ ...prev, style: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Card Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="accent">Accent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'button':
        return (
          <div className={styles.editForm}>
            <FormItem name="buttonText">
              <FormLabel>Button Text</FormLabel>
              <FormControl>
                <Input
                  value={editContent.buttonText || ''}
                  onChange={(e) => setEditContent(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="Click Here, Learn More, Contact Us..."
                />
              </FormControl>
            </FormItem>

            <FormItem name="buttonUrl">
              <FormLabel>Button Link</FormLabel>
              <FormControl>
                <Input
                  value={editContent.buttonUrl || ''}
                  onChange={(e) => setEditContent(prev => ({ ...prev, buttonUrl: e.target.value }))}
                  placeholder="/about, https://discord.gg/..., mailto:info@..."
                />
              </FormControl>
              <FormDescription>
                • Internal links: /about, /menu, /staff<br/>
                • External links: https://example.com<br/>
                • Email: mailto:contact@crimsonphoenix.com<br/>
                • Phone: tel:+1234567890
              </FormDescription>
            </FormItem>

            <div className={styles.styleOptions}>
              <Select value={editContent.style || 'default'} onValueChange={(value) => 
                setEditContent(prev => ({ ...prev, style: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Button Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="accent">Accent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={editContent.alignment || 'left'} onValueChange={(value) => 
                setEditContent(prev => ({ ...prev, alignment: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Button Alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preview of what the link will do */}
            {editContent.buttonUrl && (
              <div className={styles.linkPreview}>
                <p><strong>Link Preview:</strong></p>
                {editContent.buttonUrl.startsWith('http') && (
                  <p>🌐 Opens in new tab: {editContent.buttonUrl}</p>
                )}
                {editContent.buttonUrl.startsWith('/') && (
                  <p>🏠 Internal page: {editContent.buttonUrl}</p>
                )}
                {editContent.buttonUrl.startsWith('mailto:') && (
                  <p>📧 Opens email: {editContent.buttonUrl.replace('mailto:', '')}</p>
                )}
                {editContent.buttonUrl.startsWith('tel:') && (
                  <p>📞 Opens phone: {editContent.buttonUrl.replace('tel:', '')}</p>
                )}
              </div>
            )}
          </div>
        );

      case 'divider':
        return (
          <div className={styles.editForm}>
            <div className={styles.styleOptions}>
              <Select value={editContent.style || 'default'} onValueChange={(value) => 
                setEditContent(prev => ({ ...prev, style: value as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Divider Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Line</SelectItem>
                  <SelectItem value="thick">Thick Line</SelectItem>
                  <SelectItem value="dashed">Dashed Line</SelectItem>
                  <SelectItem value="dotted">Dotted Line</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.editForm}>
            <Textarea
              value={editContent.text || ''}
              onChange={(e) => setEditContent(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Enter content..."
              rows={4}
            />
          </div>
        );
    }
  };

  const renderPreview = () => {
    switch (block.contentType) {
      case 'text':
        return (
          <div className={`${styles.textContent} ${styles[`align-${editContent.alignment || 'left'}`]}`}>
            <p>{editContent.text || 'Empty text block'}</p>
          </div>
        );

      case 'heading':
        const HeadingTag = editContent.headingLevel || 'h2';
        return (
          <div className={`${styles.headingContent} ${styles[`align-${editContent.alignment || 'left'}`]}`}>
            <HeadingTag className={styles[HeadingTag]}>
              {editContent.heading || 'Empty heading'}
            </HeadingTag>
          </div>
        );

      case 'image':
        return (
          <div className={`${styles.imageContent} ${styles[`align-${editContent.alignment || 'center'}`]}`}>
            {editContent.imageUrl ? (
              <div className={styles.imageWrapper}>
                <img src={editContent.imageUrl} alt={editContent.title || 'Content image'} />
                {editContent.title && <p className={styles.imageCaption}>{editContent.title}</p>}
              </div>
            ) : (
              <div className={styles.imagePlaceholder}>
                <ImageIcon size={48} />
                <p>No image selected</p>
              </div>
            )}
          </div>
        );

      case 'card':
        return (
          <div className={styles.cardContent}>
            <Card className={`${styles.contentCard} ${styles[`style-${editContent.style || 'default'}`]}`}>
              {editContent.cardImage && (
                <div className={styles.cardImageWrapper}>
                  <img src={editContent.cardImage} alt={editContent.cardTitle || 'Card image'} />
                </div>
              )}
              <CardHeader>
                <CardTitle>{editContent.cardTitle || 'Card Title'}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{editContent.cardDescription || 'Card description goes here...'}</CardDescription>
              </CardContent>
            </Card>
          </div>
        );

      case 'button':
        return (
          <div className={`${styles.buttonContent} ${styles[`align-${editContent.alignment || 'left'}`]}`}>
            {editContent.buttonUrl ? (
              <Button 
                asChild
                variant={editContent.style === 'primary' ? 'default' : 'outline'}
                className={styles[`style-${editContent.style || 'default'}`]}
              >
                <a 
                  href={editContent.buttonUrl} 
                  target={editContent.buttonUrl.startsWith('http') ? '_blank' : '_self'}
                  rel={editContent.buttonUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {editContent.buttonText || 'Button Text'}
                </a>
              </Button>
            ) : (
              <Button 
                variant={editContent.style === 'primary' ? 'default' : 'outline'}
                className={styles[`style-${editContent.style || 'default'}`]}
                disabled
              >
                {editContent.buttonText || 'Button Text'}
              </Button>
            )}
          </div>
        );

      case 'divider':
        return (
          <div className={styles.dividerContent}>
            <Separator className={styles[`style-${editContent.style || 'default'}`]} />
          </div>
        );

      default:
        return (
          <div className={styles.textContent}>
            <p>{editContent.text || 'Unsupported content type'}</p>
          </div>
        );
    }
  };

  const getBlockIcon = () => {
    switch (block.contentType) {
      case 'text': return <Type size={16} />;
      case 'heading': return <Heading1 size={16} />;
      case 'image': return <ImageIcon size={16} />;
      case 'card': return <CreditCard size={16} />;
      case 'button': return <MousePointer size={16} />;
      case 'divider': return <Minus size={16} />;
      default: return <Type size={16} />;
    }
  };

  const getBlockTitle = () => {
    switch (block.contentType) {
      case 'text': return 'Text Block';
      case 'heading': return 'Heading';
      case 'image': return 'Image';
      case 'card': return 'Card';
      case 'button': return 'Button';
      case 'divider': return 'Divider';
      default: return 'Content Block';
    }
  };

  return (
    <div className={`${styles.container} ${isEditing ? styles.editing : ''}`}>
      <div className={styles.controls}>
        <div className={styles.dragHandle}>
          <Edit size={16} />
        </div>
        <div className={styles.blockInfo}>
          {getBlockIcon()}
          <span className={styles.blockTitle}>{getBlockTitle()}</span>
          <Badge variant="secondary" className={styles.blockType}>
            {block.contentType}
          </Badge>
        </div>
        <div className={styles.actions}>
          {isEditing ? (
            <>
              <Button size="sm" variant="ghost" onClick={() => setPreviewMode(!previewMode)}>
                {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save size={14} /> Save
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X size={14} /> Cancel
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit size={14} /> Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(block.sectionKey)} className={styles.deleteButton}>
                <Trash2 size={14} /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {isEditing ? (
          previewMode ? (
            <div className={styles.previewMode}>
              <div className={styles.previewHeader}>
                <span>Preview Mode</span>
              </div>
              {renderPreview()}
            </div>
          ) : (
            renderEditForm()
          )
        ) : (
          renderPreview()
        )}
      </div>
    </div>
  );
};
