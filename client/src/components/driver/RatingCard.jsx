import React from 'react';
import styles from './RatingCard.module.css';

const RatingCard = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Rating</h3>
      <div className={styles.ratingContainer}>
        <span className={styles.ratingNumber}>4.8</span>
        <div className={styles.stars}>
          <span className={styles.starFilled}>⭐</span>
          <span className={styles.starFilled}>⭐</span>
          <span className={styles.starFilled}>⭐</span>
          <span className={styles.starFilled}>⭐</span>
          <span className={styles.starEmpty}>☆</span>
        </div>
      </div>
      <div className={styles.totalRatings}>Based on 128 reviews</div>
    </div>
  );
};

export default RatingCard;