import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "../helpers/useAuth";
import { useStaffQuery as useStaffListQuery, useSiteSettingsQuery, usePagesQuery, useImagesQuery, useAdminUsersQuery } from "../helpers/useSupabaseQuery";
import { User, Settings, Image as ImageIcon, Link as LinkIcon, Users, FileText, Menu, Navigation } from "lucide-react";
import { Skeleton } from "../components/Skeleton";
import { StaffManagement } from "../components/StaffManagement";
import { SiteSettingsManagement } from "../components/SiteSettingsManagement";
import { PageContentManagement } from "../components/PageContentManagement";
import { MenuManagement } from "../components/MenuManagement";
import { ImageLibrary } from "../components/ImageLibrary";
import { AdminUserManagement } from "../components/AdminUserManagement";
import { DynamicPagesManagement } from "../components/DynamicPagesManagement";
import { NavigationManagement } from "../components/NavigationManagement";
import { Avatar, AvatarFallback, AvatarImage } from "../components/Avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import styles from "./admin.module.css";

const AdminDashboardPage: React.FC = () => {
  const { authState } = useAuth();
  const { data: staffData, isFetching: isStaffFetching, error: staffError } = useStaffListQuery();
  const { data: settingsData, isFetching: isSettingsFetching, error: settingsError } = useSiteSettingsQuery();
  const { data: pagesData, isFetching: isPagesFetching } = usePagesQuery();
  const { data: imagesData, isFetching: isImagesFetching } = useImagesQuery();
  const { data: adminUsersData, isFetching: isAdminUsersFetching } = useAdminUsersQuery();

  const isLoading = isStaffFetching || isSettingsFetching || isPagesFetching || isImagesFetching || isAdminUsersFetching;
  const error = staffError || settingsError;

  const user = authState.type === "authenticated" ? authState.user : null;

  const totalStaff = staffData?.staff?.length ?? 0;
  const publishedPages = pagesData?.pages?.filter(page => page.isPublished)?.length ?? 0;
  const totalImages = imagesData?.images?.length ?? 0;
  const totalAdminUsers = adminUsersData?.users?.length ?? 0;

  const renderContent = () => {
    if (isLoading) {
      return <DashboardSkeleton />;
    }

    if (error) {
      return (
        <div className={styles.errorState}>
          <h2>Error loading dashboard data</h2>
          <p>{error instanceof Error ? error.message : "An unknown error occurred."}</p>
        </div>
      );
    }

    return (
      <>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}><Users size={24} /></div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Staff</p>
              <p className={styles.statValue}>{totalStaff}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}><FileText size={24} /></div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Published Pages</p>
              <p className={styles.statValue}>{publishedPages}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}><ImageIcon size={24} /></div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Images</p>
              <p className={styles.statValue}>{totalImages}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}><User size={24} /></div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Admin Users</p>
              <p className={styles.statValue}>{totalAdminUsers}</p>
            </div>
          </div>
        </div>

        <div className={styles.managementTabs}>
          <Tabs defaultValue="staff" className={styles.tabs}>
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="staff">
                <Users size={16} /> Staff
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings size={16} /> Settings
              </TabsTrigger>
              <TabsTrigger value="content">
                <FileText size={16} /> Page Content
              </TabsTrigger>
              <TabsTrigger value="menu">
                <Menu size={16} /> Menu
              </TabsTrigger>
              <TabsTrigger value="images">
                <ImageIcon size={16} /> Images
              </TabsTrigger>
              <TabsTrigger value="users">
                <User size={16} /> Admin Users
              </TabsTrigger>
              <TabsTrigger value="pages">
                <FileText size={16} /> Pages
              </TabsTrigger>
              <TabsTrigger value="navigation">
                <Navigation size={16} /> Navigation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="staff" className={styles.tabContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Users className={styles.sectionIcon} /> Staff Management
                </h2>
                <p className={styles.sectionDescription}>
                  Add, edit, and manage staff members and their alts.
                </p>
                <StaffManagement staffList={staffData?.staff ?? []} />
              </div>
            </TabsContent>

            <TabsContent value="settings" className={styles.tabContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Settings className={styles.sectionIcon} /> Site Settings
                </h2>
                <p className={styles.sectionDescription}>
                  Manage global site settings like the logo and social media links.
                </p>
                <SiteSettingsManagement settings={settingsData?.settings ?? {}} />
              </div>
            </TabsContent>

            <TabsContent value="content" className={styles.tabContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <FileText className={styles.sectionIcon} /> Page Content Management
                </h2>
                <p className={styles.sectionDescription}>
                  Edit content for any page on the website.
                </p>
                <PageContentManagement />
              </div>
            </TabsContent>

            <TabsContent value="menu" className={styles.tabContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Menu className={styles.sectionIcon} /> Menu Management
                </h2>
                <p className={styles.sectionDescription}>
                  Manage menu categories and items with full CRUD operations.
                </p>
                <MenuManagement />
              </div>
            </TabsContent>

            <TabsContent value="images" className={styles.tabContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <ImageIcon className={styles.sectionIcon} /> Image Library
                </h2>
                <p className={styles.sectionDescription}>
                  Upload, manage, and delete images for use throughout the website.
                </p>
                <ImageLibrary />
              </div>
            </TabsContent>

            <TabsContent value="users" className={styles.tabContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <User className={styles.sectionIcon} /> Admin User Management
                </h2>
                <p className={styles.sectionDescription}>
                  Create, edit, and delete admin users who can access this dashboard.
                </p>
                <AdminUserManagement />
              </div>
            </TabsContent>

            <TabsContent value="pages" className={styles.tabContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <FileText className={styles.sectionIcon} /> Dynamic Pages Management
                </h2>
                <p className={styles.sectionDescription}>
                  Create, edit, delete, and publish dynamic pages.
                </p>
                <DynamicPagesManagement />
              </div>
            </TabsContent>

            <TabsContent value="navigation" className={styles.tabContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <Navigation className={styles.sectionIcon} /> Navigation Management
                </h2>
                <p className={styles.sectionDescription}>
                  Reorder pages and manage their publish status for navigation.
                </p>
                <NavigationManagement />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </>
    );
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - FFXIV Upscale Bar</title>
        <meta name="description" content="Comprehensive CMS management dashboard for website content and settings." />
      </Helmet>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Admin Dashboard</h1>
            <p className={styles.subtitle}>Welcome back, {user?.displayName || "Admin"}.</p>
          </div>
          {user && (
            <div className={styles.userProfile}>
              <Avatar>
                <AvatarImage src={user.avatarUrl ?? undefined} alt={user.displayName} />
                <AvatarFallback>{user.displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.displayName}</span>
                <span className={styles.userEmail}>{user.email}</span>
              </div>
            </div>
          )}
        </header>
        <main className={styles.mainContent}>
          {renderContent()}
        </main>
      </div>
    </>
  );
};

const DashboardSkeleton: React.FC = () => (
  <>
    <div className={styles.statsGrid}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className={styles.statCard}>
          <Skeleton style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)' }} />
          <div className={styles.statContent}>
            <Skeleton style={{ width: '80px', height: '1rem', marginBottom: 'var(--spacing-2)' }} />
            <Skeleton style={{ width: '40px', height: '1.5rem' }} />
          </div>
        </div>
      ))}
    </div>
    <div className={styles.managementTabs}>
      <Skeleton style={{ width: '100%', height: '400px' }} />
    </div>
  </>
);

export default AdminDashboardPage;
