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
import SEO from "./components/SEO";
import { useGetPageSeoQuery } from "./redux/api";
// import ContactPopup from "./components/ui/Contactpopup";

export default function Home() {
  const { data, isLoading } = useGetPageSeoQuery("home")
  let seo = data?.data?.seo
    // console.log(seo)
  return (
    <>
      {/* <SEO /> */}
      {!isLoading &&
        (<SEO
          title={seo?.metaTitle}
          description={seo?.metaDescription}
          keywords={seo?.keywords}
          canonical={seo?.canonical}
          robots={seo?.robots}

          openGraph={seo?.openGraph}
          twitter={seo?.twitter}

          schema={seo?.schema}
        />)}
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
