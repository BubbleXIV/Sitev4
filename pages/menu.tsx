import React from "react";
import { Helmet } from "react-helmet";
import { useMenuQuery } from "../helpers/useMenuQuery";
import { Skeleton } from "../components/Skeleton";
import { AlertTriangle, UtensilsCrossed } from "lucide-react";
import styles from "./menu.module.css";

const MenuPageSkeleton = () => (
  <div className={styles.container}>
    <Skeleton style={{ height: "2.5rem", width: "200px", margin: "0 auto var(--spacing-8)" }} />
    {[...Array(2)].map((_, i) => (
      <div key={i} className={styles.categorySection}>
        <Skeleton style={{ height: "2rem", width: "300px", marginBottom: "var(--spacing-6)" }} />
        <div className={styles.menuGrid}>
          {[...Array(3)].map((_, j) => (
            <div key={j} className={styles.menuItemCard}>
              <Skeleton style={{ aspectRatio: "1 / 1", width: "100%", marginBottom: "var(--spacing-4)" }} />
              <Skeleton style={{ height: "1.5rem", width: "80%", marginBottom: "var(--spacing-2)" }} />
              <Skeleton style={{ height: "1rem", width: "40%", marginBottom: "var(--spacing-4)" }} />
              <Skeleton style={{ height: "1rem", width: "100%" }} />
              <Skeleton style={{ height: "1rem", width: "90%", marginTop: "var(--spacing-2)" }} />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const MenuPage = () => {
  const { data, isFetching, error } = useMenuQuery();

  if (isFetching) {
    return <MenuPageSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertTriangle size={48} />
        <h2>Could not load menu</h2>
        <p>{error instanceof Error ? error.message : "An unknown error occurred."}</p>
      </div>
    );
  }

  const categories = data?.categories || [];

  return (
    <>
      <Helmet>
        <title>Menu | The Crimson Phoenix</title>
        <meta
          name="description"
          content="Browse the menu of The Crimson Phoenix, featuring signature cocktails, house specials, and delicious bites."
        />
      </Helmet>
      <div className={styles.container}>
        <h1 className={styles.title}>Our Menu</h1>

        {categories.length === 0 ? (
          <div className={styles.emptyState}>
            <UtensilsCrossed size={64} />
            <h2>The menu is currently empty.</h2>
            <p>Our chefs and mixologists are hard at work. Please check back soon!</p>
          </div>
        ) : (
          categories.map((category) => (
            <section key={category.id} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{category.name}</h2>
              <div className={styles.menuGrid}>
                {category.items.map((item) => (
                  <div key={item.id} className={styles.menuItemCard}>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className={styles.itemImage}
                      />
                    )}
                    <div className={styles.itemContent}>
                      <div className={styles.itemHeader}>
                        <h3 className={styles.itemName}>{item.name}</h3>
                        <span className={styles.itemPrice}>{item.priceGil.toLocaleString()} Gil</span>
                      </div>
                      {item.description && (
                        <p className={styles.itemDescription}>{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
};

export default MenuPage;