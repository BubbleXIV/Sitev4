import React from 'react';
import { Button } from './Button';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Plus, Type, Image } from 'lucide-react';
import styles from './BlockTypePicker.module.css';

interface BlockTypePickerProps {
  onSelectBlock: (type: string) => void;
  className?: string;
}

const blockTypes = [
  { type: 'text', label: 'Text Block', icon: <Type size={20} /> },
  { type: 'hero', label: 'Hero Section', icon: <Image size={20} /> },
];

export const BlockTypePicker: React.FC<BlockTypePickerProps> = ({ onSelectBlock, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (type: string) => {
    onSelectBlock(type);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="primary" size="lg">
            <Plus size={18} /> Add Content Block
          </Button>
        </PopoverTrigger>
        <PopoverContent className={styles.popoverContent}>
          <div className={styles.popoverHeader}>Select a block type</div>
          <div className={styles.grid}>
            {blockTypes.map(({ type, label, icon }) => (
              <button key={type} className={styles.item} onClick={() => handleSelect(type)}>
                <div className={styles.iconWrapper}>{icon}</div>
                <span className={styles.label}>{label}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};