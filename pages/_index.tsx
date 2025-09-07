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
          <section className={styles.hero}>
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
  const hasCustomContent = pageContent?.pageContent && pageContent.pageContent.length > 0;

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
        {/* Show PageBuilder for admins or if there's custom content */}
        {(isAdmin || hasCustomContent) && (
          <PageBuilder pageSlug="_index" />
        )}

        {/* Show default content only if no custom content exists */}
        {!hasCustomContent && (
          <>
            <section className={styles.hero}>
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

            <section className={styles.textSection}>
              <div className={styles.textContent}>
                <h2 className={styles.sectionTitle}>An Unforgettable Experience</h2>
                <p className={styles.sectionText}>
                  Nestled in the heart of the city, The Crimson Phoenix offers an escape into a world of refined elegance and quiet indulgence. Our establishment is more than just a bar; it's a sanctuary for those who appreciate the finer things—masterfully crafted cocktails, a curated selection of bites, and an atmosphere that whispers of both comfort and intrigue. Join us for an evening and discover your new favorite story.
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;