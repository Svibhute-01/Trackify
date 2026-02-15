import heroImg from "../assets/heroImg.png";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <img src={heroImg} className={styles.image} alt="Hero" />
      
  

      <div className={styles.searchCard}>
        
        <div className={styles.inputGroup}>
          <input type="text" placeholder="From" name="from"/>
          <span className={styles.arrow}>→</span>
          <input type="text" placeholder="To" name="to" />
        </div>

        <button className={styles.searchBtn}>Search Buses</button>
      </div>
    </section>
  );
};

export default HeroSection;
