import React from "react";
import { Helmet } from "react-helmet";
import { usePageContentQuery } from "../helpers/usePageContentQuery";
import { Skeleton } from "../components/Skeleton";
import { AlertTriangle } from "lucide-react";
import styles from "./services.module.css";

const ServicesPageSkeleton = () => (
  <div className={styles.container}>
    <Skeleton style={{ height: "2.5rem", width: "300px", marginBottom: "var(--spacing-4)" }} />
    <Skeleton style={{ height: "1rem", width: "80%", marginBottom: "var(--spacing-2)" }} />
    <Skeleton style={{ height: "1rem", width: "70%", marginBottom: "var(--spacing-8)" }} />
    <div className={styles.servicesGrid}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className={styles.serviceCard}>
          <Skeleton style={{ height: "1.5rem", width: "200px", marginBottom: "var(--spacing-3)" }} />
          <Skeleton style={{ height: "1rem", width: "100%", marginBottom: "var(--spacing-2)" }} />
          <Skeleton style={{ height: "1rem", width: "90%" }} />
        </div>
      ))}
    </div>
  </div>
);

const ServicesPage = () => {
  const { data, isFetching, error } = usePageContentQuery("services");

  // For now, we will just render the content. Admin editing will be added later.
  // A default structure is assumed for the content.
  const pageTitle =
    data?.pageContent.find((c) => c.sectionKey === "title")?.content ||
    "Our Services";
  const pageIntro =
    data?.pageContent.find((c) => c.sectionKey === "intro")?.content ||
    "Discover the unique experiences we offer at The Crimson Phoenix.";

  const services = data?.pageContent
    .filter((c) => c.sectionKey.startsWith("service_"))
    .reduce((acc, curr) => {
      const [_, id, field] = curr.sectionKey.split("_");
      if (!acc[id]) {
        acc[id] = { id };
      }
      acc[id][field] = curr.content;
      return acc;
    }, {} as Record<string, any>);

  const serviceItems = services ? Object.values(services) : [
    { id: '1', title: 'Private Booths', description: 'Reserve an intimate, sound-proofed booth for your private gatherings and role-playing sessions. Perfect for small groups seeking privacy and comfort.' },
    { id: '2', title: 'Live Music & Bards', description: 'Enjoy performances from Eorzea\'s finest bards. Our stage features a rotating lineup of talented musicians every evening.' },
    { id: '3', title: 'Themed Nights', description: 'From masquerade balls to fight nights, we host a variety of themed events. Check our schedule for upcoming special occasions.' },
  ];


  if (isFetching) {
    return <ServicesPageSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertTriangle size={48} />
        <h2>Could not load services</h2>
        <p>{error instanceof Error ? error.message : "An unknown error occurred."}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Services | The Crimson Phoenix</title>
        <meta
          name="description"
          content="Explore the services offered at The Crimson Phoenix, from private booths to live entertainment."
        />
      </Helmet>
      <div className={styles.container}>
        <h1 className={styles.title}>{pageTitle}</h1>
        <p className={styles.intro}>{pageIntro}</p>

        <div className={styles.servicesGrid}>
          {serviceItems.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServicesPage;