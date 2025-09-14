import React from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "../helpers/useAuth";
import { Database } from '../types/supabase';
import { usePageQuery, useServicesQuery } from '../helpers/useSupabaseQuery';
import { PageBuilder } from "../components/PageBuilder";
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
  const { authState } = useAuth();
  const { data, isFetching, error } = usePageContentQuery("services");

  const isAdmin = authState.type === "authenticated" && authState.user.role === "admin";

  if (isFetching) {
    return (
      <>
        <Helmet>
          <title>Services - The Crimson Phoenix</title>
          <meta
            name="description"
            content="Explore the services offered at The Crimson Phoenix, from private booths to live entertainment."
          />
        </Helmet>
        <ServicesPageSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Services - The Crimson Phoenix</title>
          <meta
            name="description"
            content="Explore the services offered at The Crimson Phoenix, from private booths to live entertainment."
          />
        </Helmet>
        <div className={styles.errorContainer}>
          <AlertTriangle size={48} />
          <h2>Could not load services</h2>
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
        <title>Services - The Crimson Phoenix</title>
        <meta
          name="description"
          content="Explore the services offered at The Crimson Phoenix, from private booths to live entertainment."
        />
      </Helmet>
      <div className={styles.container}>
        {/* Show PageBuilder for admins or if there's custom content */}
        {(isAdmin || hasCustomContent) && (
          <PageBuilder pageSlug="services" />
        )}

        {/* Show default content only if no custom content exists */}
        {!hasCustomContent && (
          <>
            <h1 className={styles.title}>Our Services</h1>
            <p className={styles.intro}>
              Discover the unique experiences we offer at The Crimson Phoenix.
            </p>

            <div className={styles.servicesGrid}>
              <div className={styles.serviceCard}>
                <h3 className={styles.serviceTitle}>Private Booths</h3>
                <p className={styles.serviceDescription}>
                  Reserve an intimate, sound-proofed booth for your private gatherings and role-playing sessions. 
                  Perfect for small groups seeking privacy and comfort.
                </p>
              </div>
              <div className={styles.serviceCard}>
                <h3 className={styles.serviceTitle}>Live Music & Bards</h3>
                <p className={styles.serviceDescription}>
                  Enjoy performances from Eorzea's finest bards. Our stage features a rotating lineup of 
                  talented musicians every evening.
                </p>
              </div>
              <div className={styles.serviceCard}>
                <h3 className={styles.serviceTitle}>Themed Nights</h3>
                <p className={styles.serviceDescription}>
                  From masquerade balls to fight nights, we host a variety of themed events. 
                  Check our schedule for upcoming special occasions.
                </p>
              </div>
              <div className={styles.serviceCard}>
                <h3 className={styles.serviceTitle}>Event Hosting</h3>
                <p className={styles.serviceDescription}>
                  Let us host your special occasion. From intimate celebrations to grand parties, 
                  we provide full event planning and catering services.
                </p>
              </div>
              <div className={styles.serviceCard}>
                <h3 className={styles.serviceTitle}>VIP Experience</h3>
                <p className={styles.serviceDescription}>
                  Enjoy premium service with our VIP package including priority seating, 
                  exclusive menu items, and dedicated staff attention.
                </p>
              </div>
              <div className={styles.serviceCard}>
                <h3 className={styles.serviceTitle}>Corporate Events</h3>
                <p className={styles.serviceDescription}>
                  Professional venue for business meetings, networking events, and corporate celebrations. 
                  Discrete service and upscale atmosphere guaranteed.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ServicesPage;
