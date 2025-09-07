import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useStaffListQuery } from "../helpers/useStaffQuery";
import { StaffWithAlts } from "../endpoints/staff/list_GET.schema";
import { Skeleton } from "../components/Skeleton";
import { Users, Repeat, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./staff.module.css";

const StaffCard: React.FC<{
  staff: StaffWithAlts;
}> = ({ staff }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeAltIndex, setActiveAltIndex] = useState(0);

  const hasAlts = staff.alts && staff.alts.length > 0;

  const handleFlip = () => {
    if (!hasAlts) return;
    setIsFlipped(!isFlipped);
    setActiveAltIndex(0); // Reset to first alt on flip
  };

  const handlePrevAlt = () => {
    if (!hasAlts) return;
    const newIndex = activeAltIndex === 0 ? staff.alts.length - 1 : activeAltIndex - 1;
    setActiveAltIndex(newIndex);
  };

  const handleNextAlt = () => {
    if (!hasAlts) return;
    const newIndex = activeAltIndex === staff.alts.length - 1 ? 0 : activeAltIndex + 1;
    setActiveAltIndex(newIndex);
  };

  // Get the character to display (main or alt)
  const displayCharacter = isFlipped && hasAlts ? staff.alts[activeAltIndex] : staff;

  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.card} ${isFlipped ? styles.isFlipped : ""}`}>
        {/* Single card face that transitions content smoothly */}
        <div className={styles.cardFace}>
          <CharacterDisplay 
            character={displayCharacter} 
            isAlt={isFlipped && hasAlts} 
            altIndex={activeAltIndex}
            totalAlts={hasAlts ? staff.alts.length : 0}
          />
        </div>
      </div>
      
      {hasAlts && (
        <div className={styles.controls}>
          <button onClick={handleFlip} className={styles.flipButton}>
            <Repeat size={16} />
            <span>{isFlipped ? "Show Main" : "Show Alts"}</span>
          </button>
          {isFlipped && staff.alts.length > 1 && (
            <div className={styles.altNavigation}>
              <button 
                onClick={handlePrevAlt} 
                className={styles.navButton}
                aria-label="Previous alt"
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.altCounter}>
                {activeAltIndex + 1} of {staff.alts.length}
              </span>
              <button 
                onClick={handleNextAlt} 
                className={styles.navButton}
                aria-label="Next alt"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          {isFlipped && (
            <div className={styles.altIndicator}>
              <span className={styles.altLabel}>Alt Character</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CharacterDisplay: React.FC<{
  character: StaffWithAlts | StaffWithAlts["alts"][number];
  isAlt?: boolean;
  altIndex?: number;
  totalAlts?: number;
}> = ({ character, isAlt = false, altIndex = 0, totalAlts = 0 }) => (
  <div className={`${styles.characterContent} ${isAlt ? styles.altCharacter : ''}`}>
    <div className={styles.cardImageWrapper}>
      <img
        src={character.pictureUrl || "/placeholder-avatar.png"}
        alt={character.name}
        className={styles.cardImage}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
        }}
      />
      {isAlt && (
        <div className={styles.altBadge}>
          <span>Alt {altIndex + 1}</span>
        </div>
      )}
    </div>
    <div className={styles.cardContent}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardName}>{character.name}</h3>
        {isAlt && totalAlts > 1 && (
          <span className={styles.altIndicatorText}>
            {altIndex + 1}/{totalAlts}
          </span>
        )}
      </div>
      <p className={styles.cardRole}>{character.role}</p>
      <p className={styles.cardBio}>{character.bio}</p>
    </div>
  </div>
);

const StaffPage: React.FC = () => {
  const { data, isFetching, error } = useStaffListQuery();

  const renderContent = () => {
    if (isFetching) {
      return (
        <div className={styles.staffGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <Skeleton className={styles.skeletonImage} />
              <div className={styles.skeletonContent}>
                <Skeleton style={{ height: "1.5rem", width: "70%" }} />
                <Skeleton style={{ height: "1rem", width: "50%" }} />
                <Skeleton style={{ height: "0.75rem", width: "90%" }} />
                <Skeleton style={{ height: "0.75rem", width: "80%" }} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorState}>
          <p>Failed to load staff members. Please try again later.</p>
        </div>
      );
    }

    if (!data || data.staff.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Users size={48} />
          <p>No staff members have been added yet.</p>
        </div>
      );
    }

    return (
      <div className={styles.staffGrid}>
        {data.staff.map((staffMember) => (
          <StaffCard key={staffMember.id} staff={staffMember} />
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Our Staff - The Crimson Phoenix</title>
        <meta
          name="description"
          content="Meet the talented team behind The Crimson Phoenix. Our staff are dedicated to providing you with an exceptional experience."
        />
      </Helmet>
      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Meet the Team</h1>
          <p className={styles.pageSubtitle}>
            The heart and soul of The Crimson Phoenix, dedicated to crafting
            your perfect evening.
          </p>
        </div>
        {renderContent()}
      </div>
    </>
  );
};

export default StaffPage;
