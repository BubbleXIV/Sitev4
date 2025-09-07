import React from "react";
import { Helmet } from "react-helmet";
import { usePageContentQuery } from "../helpers/usePageContentQuery";
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
  const { data, isFetching, error } = usePageContentQuery("about");

  // For now, we will just render the content. Admin editing will be added later.
  // A default structure is assumed for the content.
  const pageTitle =
    data?.pageContent.find((c) => c.sectionKey === "title")?.content ||
    "About The Crimson Phoenix";
  const paragraph1 =
    data?.pageContent.find((c) => c.sectionKey === "paragraph1")?.content ||
    "Born from a shared vision of creating an unparalleled social experience, The Crimson Phoenix is more than just a bar—it's a sanctuary. Nestled in the heart of the city, we offer a sophisticated escape for adventurers, artisans, and aristocrats alike. Our establishment prides itself on its meticulously crafted ambiance, where classic elegance meets modern comfort.";
  const paragraph2 =
    data?.pageContent.find((c) => c.sectionKey === "paragraph2")?.content ||
    "Our philosophy is simple: provide exceptional service, exquisite drinks, and an unforgettable atmosphere. Every detail, from the curated music to the ambient lighting, is designed to transport you. Whether you're here for a quiet drink, a lively discussion, or a grand celebration, The Crimson Phoenix is your stage.";
  const imageUrl =
    data?.pageContent.find((c) => c.sectionKey === "image")?.content ||
    "https://via.placeholder.com/800x1000.png/222838/4d3a2f?text=The+Crimson+Phoenix";

  if (isFetching) {
    return <AboutPageSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertTriangle size={48} />
        <h2>Could not load about page</h2>
        <p>{error instanceof Error ? error.message : "An unknown error occurred."}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>About Us | The Crimson Phoenix</title>
        <meta
          name="description"
          content="Learn the story behind The Crimson Phoenix, our philosophy, and our commitment to providing an exceptional experience."
        />
      </Helmet>
      <div className={styles.container}>
        <div className={styles.contentGrid}>
          <div className={styles.textSection}>
            <h1 className={styles.title}>{pageTitle}</h1>
            <p className={styles.paragraph}>{paragraph1}</p>
            <p className={styles.paragraph}>{paragraph2}</p>
          </div>
          <div className={styles.imageSection}>
            <img src={imageUrl} alt="The Crimson Phoenix interior" className={styles.image} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;