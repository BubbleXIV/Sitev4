import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Skeleton } from "../components/Skeleton";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../helpers/useAuth";
import { usePageContentQuery } from "../helpers/usePageContentQuery";
import { PageBuilder } from "../components/PageBuilder";
import styles from "./_index.module.css";

const HomePage: React.FC = () => {
  const { authState } = useAuth();
  const { data: pageContent, isFetching } = usePageContentQuery("_index");

  const isAdmin = authState.type === "authenticated" && authState.user.role === "admin";

  // Extract background image from page content
  const backgroundImageContent = pageContent?.pageContent?.find(
    item => item.sectionKey === 'hero-background' || item.contentType === 'hero-background'
  );
  
  let backgroundImageUrl = 'https://via.placeholder.com/1920x1080.png/2a1810/d4af37?text=The+Crimson+Phoenix';
  
  if (backgroundImageContent?.content) {
    try {
      const parsed = JSON.parse(backgroundImageContent.content);
      backgroundImageUrl = parsed.imageUrl || backgroundImageUrl;
    } catch {
      // Use default if parsing fails
    }
  }

  if (isFetching) {
    return (
      <>
        <Helmet>
          <title>The Crimson Phoenix - Home</title>
          <meta
            name="description"
            content="Welcome to The Crimson Phoenix, Eorzea's premier upscale bar and lounge."
          />
        </Helmet>
        <div className={styles.homePage}>
          <section className={styles.hero} style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <Skeleton style={{ width: "60%", height: "4rem", margin: "0 auto 1rem" }} />
              <Skeleton style={{ width: "80%", height: "1.5rem", margin: "0 auto 2rem" }} />
              <div className={styles.heroActions}>
                <Skeleton style={{ width: "150px", height: "3rem" }} />
                <Skeleton style={{ width: "150px", height: "3rem" }} />
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  // Check if we have custom content from PageBuilder
  const hasCustomContent = pageContent?.pageContent && pageContent.pageContent.filter(
    item => item.sectionKey !== 'hero-background' && item.contentType !== 'hero-background'
  ).length > 0;

  return (
    <>
      <Helmet>
        <title>The Crimson Phoenix - Home</title>
        <meta
          name="description"
          content="Welcome to The Crimson Phoenix, Eorzea's premier upscale bar and lounge. Experience unparalleled ambiance, signature cocktails, and unforgettable nights."
        />
      </Helmet>
      <div className={styles.homePage}>
        {/* Hero section with editable background */}
        <section className={styles.hero} style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>The Crimson Phoenix</h1>
            <p className={styles.heroSubtitle}>
              Where legends unwind and stories are forged in firelight.
            </p>
            <div className={styles.heroActions}>
              <Button asChild size="lg" className={styles.ctaButton}>
                <Link to="/menu">Explore the Menu</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className={styles.secondaryButton}
              >
                <Link to="/staff">
                  Meet the Team <ArrowRight size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Admin notice for background editing */}
        {isAdmin && (
          <div className={styles.adminNotice}>
            <p>
              <strong>Admin:</strong> To change the hero background image, add an "Image" content block below 
              and set its section key to "hero-background" when editing.
            </p>
          </div>
        )}

        {/* Page Builder Content */}
        {(isAdmin || hasCustomContent) && (
          <div className={styles.editableContent}>
            <PageBuilder pageSlug="_index" />
          </div>
        )}

        {/* Default content section - always show */}
        {!hasCustomContent && (
          <section className={styles.textSection}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>An Unforgettable Experience</h2>
              <p className={styles.sectionText}>
                Nestled in the heart of the city, The Crimson Phoenix offers an escape into a world of 
                refined elegance and quiet indulgence. Our establishment is more than just a bar; it's a 
                sanctuary for those who appreciate the finer things—masterfully crafted cocktails, a curated 
                selection of bites, and an atmosphere that whispers of both comfort and intrigue.
              </p>
              <p className={styles.sectionText}>
                Join us for an evening and discover your new favorite story. Whether you're seeking intimate 
                conversation, lively entertainment, or simply the perfect cocktail, The Crimson Phoenix awaits 
                to make your evening extraordinary.
              </p>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default HomePage;
