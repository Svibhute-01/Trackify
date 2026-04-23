import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSection";
import Features from "../../components/landing/Features";
import HowItWorks from "../../components/landing/HowItWorks";
import Stats from "../../components/landing/Stats";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";

const Home = () => (
  <>
    <Navbar />
    <HeroSection />
    <Features />
    <HowItWorks />
    <Stats />
    <CTA />
    <Footer />
  </>
);

export default Home;
