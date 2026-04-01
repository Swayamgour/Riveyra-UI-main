import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Services from "./components/sections/Services";
import Portfolio from "./components/sections/Portfolio";
import Testimonials from "./components/sections/Testimonials";
import CTA from "./components/sections/CTA";
import FloatingCards from "./components/animations/FloatingCards";
import OrbitGallery from "./components/animations/OrbitGallery";
import DraggableCube from "./components/animations/DraggableCube";
import ParallaxSection from "./components/animations/ParallaxSection";
import Clients from "./components/sections/Clients";
// import ContactPopup from "./components/ui/Contactpopup";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <ContactPopup /> */}
      <ParallaxSection />
      <About />
      <Services />
      <FloatingCards />
      <OrbitGallery />
      <Clients />
      <DraggableCube />
      <Portfolio />
      <Testimonials />
      <CTA />
    </>
  );
}
