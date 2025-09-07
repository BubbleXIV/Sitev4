import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../helpers/useAuth";
import { useSiteSettingsQuery } from "../helpers/useSiteSettingsQuery";
import { usePagesQuery } from "../helpers/usePagesQuery";
import { Button } from "./Button";
import { LogIn, LogOut, User, Settings } from "lucide-react";
import styles from "./MainLayout.module.css";

const BlueskyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
  >
    <path d="M12 1.75a10.25 10.25 0 100 20.5 10.25 10.25 0 000-20.5zm4.99 8.43c.03 1.84-.48 3.68-1.48 5.24a8.2 8.2 0 01-3.5 3.5c-1.56 1-3.4 1.51-5.24 1.48a8.2 8.2 0 01-6.02-3.1 1.5 1.5 0 012.12-2.12 5.2 5.2 0 007.8-6.2 1.5 1.5 0 012.3-1.93z" />
  </svg>
);

const DiscordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="24"
    height="24"
  >
    <path d="M20.3,3.7C18.8,2.8,17.1,2.2,15.4,2c-0.1,0.3-0.3,0.6-0.4,0.9c-1.5-0.4-3-0.4-4.5,0C10.3,2.6,10.1,2.3,10,2C8.3,2.2,6.6,2.8,5.1,3.7C2.2,7.3,1.5,11.3,2.2,15.1c1.6,1.2,3.3,2,5.1,2.6c0.4-0.6,0.8-1.2,1.1-1.8c-0.5-0.2-1-0.4-1.5-0.7c-0.2-0.1-0.3-0.2-0.4-0.3c0-0.1,0-0.1,0-0.2c1.2,0.8,2.5,1.3,3.9,1.5c1.4-0.2,2.7-0.7,3.9-1.5c0,0.1,0,0.1,0,0.2c-0.1,0.1-0.2,0.2-0.4,0.3c-0.5,0.3-1,0.5-1.5,0.7c0.3,0.6,0.7,1.2,1.1,1.8c1.8-0.6,3.5-1.4,5.1-2.6C22.9,11.3,22.2,7.3,20.3,3.7z M8.7,13.2c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S9.5,13.2,8.7,13.2z M15.3,13.2c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S16.1,13.2,15.3,13.2z" />
  </svg>
);

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { authState, logout } = useAuth();
  const { data: settingsData } = useSiteSettingsQuery();
  const { data: pagesData } = usePagesQuery();

  const settings = settingsData?.settings || {};
  const logoUrl = settings.logoUrl || "/default-logo.png";
  const blueskyUrl = settings.blueskyUrl || "#";
  const discordUrl = settings.discordUrl || "#";

  // Get published pages sorted by display order
  const publishedPages = (pagesData?.pages || [])
    .filter(page => page.isPublished)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  // Always show certain pages
  const alwaysVisiblePages = [
    { slug: '', title: 'Home', displayOrder: -2 },
    { slug: 'staff', title: 'Staff', displayOrder: -1 }
  ];

  // Combine always visible pages with published pages, avoiding duplicates
  const allPages = [
    ...alwaysVisiblePages,
    ...publishedPages.filter(page => !['', 'staff'].includes(page.slug))
  ].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logo}>
            {logoUrl ? (
              <img src={logoUrl} alt="The Crimson Phoenix Logo" />
            ) : (
              <span>The Crimson Phoenix</span>
            )}
          </Link>
          <nav className={styles.nav}>
            {allPages.map((page) => (
              <NavLink
                key={page.slug || 'home'}
                to={page.slug ? `/${page.slug}` : '/'}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
              >
                {page.title}
              </NavLink>
            ))}
          </nav>
          <div className={styles.authActions}>
            {authState.type === "authenticated" ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin">
                    <Settings size={16} /> Admin
                  </Link>
                </Button>
                <Button onClick={logout} variant="outline" size="sm">
                  <LogOut size={16} /> Logout
                </Button>
              </>
            ) : (
              <Button asChild variant="primary" size="sm">
                <Link to="/login">
                  <LogIn size={16} /> Admin Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; {new Date().getFullYear()} The Crimson Phoenix. All rights reserved.</p>
          <div className={styles.socialLinks}>
            <a
              href={blueskyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bluesky"
            >
              <BlueskyIcon />
            </a>
            <a
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <DiscordIcon />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};