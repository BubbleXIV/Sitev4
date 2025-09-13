import React, { useState } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { Badge } from './Badge';
import { Skeleton } from './Skeleton';
import { 
  FileText, 
  Edit, 
  Eye, 
  Home, 
  Users, 
  Briefcase, 
  Info, 
  ExternalLink 
} from 'lucide-react';
import { PageBuilder } from './PageBuilder';
import { Database } from '../types/supabase';
import { usePageContentQuery, useUpdatePageContentMutation } from '../helpers/useSupabaseQuery';
import styles from './PageContentManagement.module.css';

interface PageOption {
  slug: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const availablePages: PageOption[] = [
  {
    slug: '_index',
    name: 'Home Page',
    description: 'Main landing page with hero section and introduction',
    icon: <Home size={20} />,
    route: '/'
  },
  {
    slug: 'about',
    name: 'About Us',
    description: 'Company story, mission, and values',
    icon: <Info size={20} />,
    route: '/about'
  },
  {
    slug: 'services',
    name: 'Services',
    description: 'Service offerings and features',
    icon: <Briefcase size={20} />,
    route: '/services'
  },
  {
    slug: 'staff',
    name: 'Staff Page',
    description: 'Team members and profiles (content above staff list)',
    icon: <Users size={20} />,
    route: '/staff'
  }
];

export const PageContentManagement: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const { data: pageContent, isFetching } = usePageContentQuery(selectedPage || '');

  const renderPageSelector = () => (
    <div className={styles.pageSelectorContainer}>
      <div className={styles.selectorHeader}>
        <h3>Select a Page to Edit</h3>
        <p>Choose which page content you want to manage and customize.</p>
      </div>
      
      <div className={styles.pageGrid}>
        {availablePages.map((page) => (
          <Card 
            key={page.slug} 
            className={`${styles.pageCard} ${selectedPage === page.slug ? styles.selected : ''}`}
            onClick={() => {
              setSelectedPage(page.slug);
              setPreviewMode(false);
            }}
          >
            <CardHeader className={styles.pageCardHeader}>
              <div className={styles.pageIcon}>
                {page.icon}
              </div>
              <div className={styles.pageInfo}>
                <CardTitle className={styles.pageCardTitle}>
                  {page.name}
                </CardTitle>
                <CardDescription className={styles.pageCardDescription}>
                  {page.description}
                </CardDescription>
              </div>
              <div className={styles.pageActions}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(page.route, '_blank');
                  }}
                >
                  <ExternalLink size={14} />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className={styles.quickTips}>
        <h4>Quick Tips:</h4>
        <ul>
          <li><strong>Home Page:</strong> Add hero content, feature sections, and call-to-action blocks</li>
          <li><strong>About Us:</strong> Tell your story with text, images, and highlight cards</li>
          <li><strong>Services:</strong> Showcase offerings with cards and detailed descriptions</li>
          <li><strong>Staff:</strong> Add introductory content above the staff member cards</li>
        </ul>
      </div>
    </div>
  );

  const renderPageEditor = () => {
    const currentPage = availablePages.find(p => p.slug === selectedPage);
    
    if (!currentPage) return null;

    return (
      <div className={styles.pageEditorContainer}>
        <div className={styles.editorHeader}>
          <div className={styles.editorInfo}>
            <Button 
              variant="ghost" 
              onClick={() => setSelectedPage(null)}
              className={styles.backButton}
            >
              ← Back to Page Selection
            </Button>
            <div className={styles.currentPageInfo}>
              <div className={styles.pageIconSmall}>
                {currentPage.icon}
              </div>
              <div>
                <h2 className={styles.currentPageTitle}>
                  Editing: {currentPage.name}
                </h2>
                <p className={styles.currentPageDescription}>
                  {currentPage.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className={styles.editorActions}>
            <Button
              variant="outline"
              onClick={() => window.open(currentPage.route, '_blank')}
            >
              <ExternalLink size={16} /> View Live
            </Button>
            <Badge variant="secondary" className={styles.pageSlugBadge}>
              {selectedPage}
            </Badge>
          </div>
        </div>

        {/* Content Statistics */}
        {pageContent?.pageContent && (
          <div className={styles.contentStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{pageContent.pageContent.length}</span>
              <span className={styles.statLabel}>Content Blocks</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {pageContent.pageContent.filter(item => item.contentType === 'text').length}
              </span>
              <span className={styles.statLabel}>Text Blocks</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {pageContent.pageContent.filter(item => item.contentType === 'image').length}
              </span>
              <span className={styles.statLabel}>Images</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {pageContent.pageContent.filter(item => item.contentType === 'card').length}
              </span>
              <span className={styles.statLabel}>Cards</span>
            </div>
          </div>
        )}

        <div className={styles.editorContent}>
          {isFetching ? (
            <div className={styles.editorSkeleton}>
              <Skeleton style={{ height: '4rem', marginBottom: 'var(--spacing-4)' }} />
              <Skeleton style={{ height: '20rem', marginBottom: 'var(--spacing-4)' }} />
              <Skeleton style={{ height: '8rem' }} />
            </div>
          ) : (
            <PageBuilder pageSlug={selectedPage} className={styles.pageBuilder} />
          )}
        </div>

        {/* Special Instructions for Different Pages */}
        <div className={styles.pageInstructions}>
          {selectedPage === '_index' && (
            <div className={styles.instructionCard}>
              <h4>Home Page Instructions:</h4>
              <ul>
                <li>To change the hero background image, add an Image block and it will automatically be used as the background</li>
                <li>Use Heading blocks for section titles</li>
                <li>Add Cards to highlight key features or services</li>
                <li>Use Buttons for call-to-action elements</li>
              </ul>
            </div>
          )}
          {selectedPage === 'about' && (
            <div className={styles.instructionCard}>
              <h4>About Page Instructions:</h4>
              <ul>
                <li>Start with a compelling heading about your story</li>
                <li>Use Text blocks for your company narrative</li>
                <li>Add Images to show your venue or team</li>
                <li>Use Cards to highlight key values or milestones</li>
              </ul>
            </div>
          )}
          {selectedPage === 'services' && (
            <div className={styles.instructionCard}>
              <h4>Services Page Instructions:</h4>
              <ul>
                <li>Use Cards to showcase each service offering</li>
                <li>Include Images for visual appeal</li>
                <li>Add Buttons to link to booking or contact forms</li>
                <li>Use Dividers to separate different service categories</li>
              </ul>
            </div>
          )}
          {selectedPage === 'staff' && (
            <div className={styles.instructionCard}>
              <h4>Staff Page Instructions:</h4>
              <ul>
                <li>This content appears above the staff member cards</li>
                <li>Add an introductory heading and description</li>
                <li>Use Images to show team photos or venue shots</li>
                <li>Staff individual profiles are managed in the Staff tab</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageContentManagement}>
      {!selectedPage ? renderPageSelector() : renderPageEditor()}
    </div>
  );
};
        
