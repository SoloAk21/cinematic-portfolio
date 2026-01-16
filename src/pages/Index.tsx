import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Showreel from "@/components/Showreel";
import Services from "@/components/Services";
import BehindTheScenes from "@/components/BehindTheScenes";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="smooth-scroll">
      <Navigation />
      <Hero />
      <About />
      <Showreel />
      <Services />
      <BehindTheScenes />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
