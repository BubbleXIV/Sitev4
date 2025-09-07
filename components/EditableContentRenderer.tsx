import React from 'react';
import styles from './EditableContentRenderer.module.css';

interface EditableContentRendererProps {
  contentType: string;
  content: string | null;
  className?: string;
}

export const EditableContentRenderer: React.FC<EditableContentRendererProps> = ({ contentType, content, className }) => {
  const safeParseContent = () => {
    try {
      return content ? JSON.parse(content) : {};
    } catch (e) {
      console.error(`Failed to parse content for type ${contentType}:`, e);
      return { error: 'Invalid content format' };
    }
  };

  const data = safeParseContent();

  if (data.error) {
    return <div className={`${styles.error} ${className || ''}`}>{data.error}</div>;
  }

  switch (contentType) {
    case 'hero':
      return (
        <div
          className={`${styles.hero} ${className || ''}`}
          style={{ backgroundImage: data.imageUrl ? `url(${data.imageUrl})` : 'none' }}
        >
          <div className={styles.heroOverlay}>
            <h1 className={styles.heroTitle}>{data.title || 'Hero Title'}</h1>
            {data.subtitle && <p className={styles.heroSubtitle}>{data.subtitle}</p>}
          </div>
        </div>
      );
    case 'text':
      return (
        <div className={`${styles.text} ${className || ''}`}>
          <p>{data.text || 'Text content goes here.'}</p>
        </div>
      );
    default:
      return (
        <div className={`${styles.unknown} ${className || ''}`}>
          Unknown content type: <strong>{contentType}</strong>
        </div>
      );
  }
};