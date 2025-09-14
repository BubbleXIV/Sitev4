import React, { useState } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Badge } from './Badge';
import { 
  Plus, 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  Image as ImageIcon, 
  CreditCard, 
  MousePointer, 
  Minus,
  X
} from 'lucide-react';
import styles from './BlockTypePicker.module.css';

interface BlockTypePickerProps {
  onSelectBlock: (type: string) => void;
}

interface BlockType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'content' | 'media' | 'layout' | 'interactive';
}

const blockTypes: BlockType[] = [
  {
    id: 'text',
    name: 'Text Block',
    description: 'Add paragraphs, descriptions, and body text',
    icon: <Type size={24} />,
    category: 'content'
  },
  {
    id: 'heading',
    name: 'Heading',
    description: 'Add section titles and headings (H1-H6)',
    icon: <Heading1 size={24} />,
    category: 'content'
  },
  {
    id: 'image',
    name: 'Image',
    description: 'Upload or link images with captions',
    icon: <ImageIcon size={24} />,
    category: 'media'
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Feature cards with title, description, and image',
    icon: <CreditCard size={24} />,
    category: 'content'
  },
  {
    id: 'button',
    name: 'Button',
    description: 'Call-to-action buttons with custom styling',
    icon: <MousePointer size={24} />,
    category: 'interactive'
  },
  {
    id: 'divider',
    name: 'Divider',
    description: 'Visual separators and section breaks',
    icon: <Minus size={24} />,
    category: 'layout'
  }
];

const categories = {
  content: { name: 'Content', color: 'blue' },
  media: { name: 'Media', color: 'purple' },
  layout: { name: 'Layout', color: 'green' },
  interactive: { name: 'Interactive', color: 'orange' }
};

export const BlockTypePicker: React.FC<BlockTypePickerProps> = ({ onSelectBlock }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelectBlock = (blockType: string) => {
    onSelectBlock(blockType);
    setIsOpen(false);
    setSelectedCategory(null);
  };

  const filteredBlocks = selectedCategory 
    ? blockTypes.filter(block => block.category === selectedCategory)
    : blockTypes;

  const groupedBlocks = filteredBlocks.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {} as Record<string, BlockType[]>);

  if (!isOpen) {
    return (
      <div className={styles.addBlockContainer}>
        <Button 
          onClick={() => setIsOpen(true)} 
          variant="outline" 
          size="lg"
          className={styles.addBlockButton}
        >
          <Plus size={20} />
          Add Content Block
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.blockPicker}>
      <div className={styles.pickerHeader}>
        <h3 className={styles.pickerTitle}>Choose Content Block</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsOpen(false)}
          className={styles.closeButton}
        >
          <X size={16} />
        </Button>
      </div>

      <div className={styles.categoryFilters}>
        <Button
          variant={selectedCategory === null ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className={styles.categoryButton}
        >
          All Blocks
        </Button>
        {Object.entries(categories).map(([key, category]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(key)}
            className={styles.categoryButton}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className={styles.blocksContainer}>
        {Object.entries(groupedBlocks).map(([categoryKey, blocks]) => (
          <div key={categoryKey} className={styles.blockCategory}>
            {!selectedCategory && (
              <div className={styles.categoryHeader}>
                <Badge variant="outline" className={styles.categoryBadge}>
                  {categories[categoryKey as keyof typeof categories].name}
                </Badge>
              </div>
            )}
            <div className={styles.blockGrid}>
              {blocks.map((blockType) => (
                <Card 
                  key={blockType.id} 
                  className={styles.blockCard}
                  onClick={() => handleSelectBlock(blockType.id)}
                >
                  <CardHeader className={styles.blockCardHeader}>
                    <div className={styles.blockIcon}>
                      {blockType.icon}
                    </div>
                    <CardTitle className={styles.blockCardTitle}>
                      {blockType.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={styles.blockCardContent}>
                    <CardDescription className={styles.blockCardDescription}>
                      {blockType.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredBlocks.length === 0 && (
        <div className={styles.emptyState}>
          <p>No blocks found in this category.</p>
        </div>
      )}
    </div>
  );
};
