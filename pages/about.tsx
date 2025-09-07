import React from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "../helpers/useAuth";
import { usePageContentQuery } from "../helpers/usePageContentQuery";
import { PageBuilder } from "../components/PageBuilder";
import { Skeleton } from "../components/Skeleton";
import { AlertTriangle } from "lucide-react";
import styles from "./about.module.css";

const AboutPageSkeleton = () => (
  <div className={styles.container}>
    <div className={styles.contentGrid}>
      <div className={styles.textSection}>
        <Skeleton style={{ height: "2.5rem", width: "300px", marginBottom: "var(--spacing-4)" }} />
        <Skeleton style={{ height: "1rem", width: "100%", marginBottom: "var(--spacing-2)" }} />
        <Skeleton style={{ height: "1rem", width: "90%", marginBottom: "var(--spacing-6)" }} />
        <Skeleton style={{ height: "1rem", width: "100%", marginBottom: "var(--spacing-2)" }} />
        <Skeleton style={{ height: "1rem", width: "95%", marginBottom: "var(--spacing-2)" }} />
        <Skeleton style={{ height: "1rem", width: "80%" }} />
      </div>
      <div className={styles.imageSection}>
        <Skeleton style={{ width: "100%", height: "400px", borderRadius: "var(--radius-lg)" }} />
      </div>
    </div>
  </div>
);

const AboutPage = () => {
  const { authState } = useAuth();
  const { data, isFetching, error } = usePageContentQuery("about");

  const isAdmin = authState.type === "authenticated" && authState.user.role === "admin";

  if (isFetching) {
    return (
      <>
        <Helmet>
          <title>About Us - The Crimson Phoenix</title>
          <meta
            name="description"
            content="Learn the story behind The Crimson Phoenix, our philosophy, and our commitment to providing an exceptional experience."
          />
        </Helmet>
        <AboutPageSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>About Us - The Crimson Phoenix</title>
          <meta
            name="description"
            content="Learn the story behind The Crimson Phoenix, our philosophy, and our commitment to providing an exceptional experience."
          />
        </Helmet>
        <div className={styles.errorContainer}>
          <AlertTriangle size={48} />
          <h2>Could not load about page</h2>
          <p>{error instanceof Error ? error.message : "An unknown error occurred."}</p>
        </div>
      </>
    );
  }

  // Check if we have custom content from PageBuilder
  const hasCustomContent = data?.pageContent && data.pageContent.length > 0;

  return (
    <>
      <Helmet>
        <title>About Us - The Crimson Phoenix</title>
        <meta
          name="description"
          content="Learn the story behind The Crimson Phoenix, our philosophy, and our commitment to providing an exceptional experience."
        />
      </Helmet>
      <div className={styles.container}>
        {/* Show PageBuilder for admins or if there's custom content */}
        {(isAdmin || hasCustomContent) && (
          <PageBuilder pageSlug="about" />
        )}

        {/* Show default content only if no custom content exists */}
        {!hasCustomContent && (
          <div className={styles.contentGrid}>
            <div className={styles.textSection}>
              <h1 className={styles.title}>About The Crimson Phoenix</h1>
              <p className={styles.paragraph}>
                Born from a shared vision of creating an unparalleled social experience, The Crimson Phoenix 
                is more than just a bar—it's a sanctuary. Nestled in the heart of the city, we offer a 
                sophisticated escape for adventurers, artisans, and aristocrats alike. Our establishment 
                prides itself on its meticulously crafted ambiance, where classic elegance meets modern comfort.
              </p>
              <p className={styles.paragraph}>
                Our philosophy is simple: provide exceptional service, exquisite drinks, and an unforgettable 
                atmosphere. Every detail, from the curated music to the ambient lighting, is designed to 
                transport you. Whether you're here for a quiet drink, a lively discussion, or a grand 
                celebration, The Crimson Phoenix is your stage.
              </p>
              <p className={styles.paragraph}>
                Step into our world and discover what makes us different. From our carefully selected staff 
                to our signature cocktails, every element has been chosen to create moments that linger long 
                after the evening ends. Welcome to The Crimson Phoenix—where every visit tells a story.
              </p>
            </div>
            <div className={styles.imageSection}>
              <img 
                src="https://via.placeholder.com/600x800.png/2a1810/d4af37?text=The+Crimson+Phoenix+Interior" 
                alt="The Crimson Phoenix interior" 
                className={styles.image} 
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AboutPage;
