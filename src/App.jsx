import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import CustomCursor from './components/layout/CustomCursor'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './Home'
import Contact from './components/sections/Contact'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import CareerPage from './pages/CareerPage'
import BlogsPage from './pages/BlogsPage'
import BlogDetailPage from './pages/BlogDetailPage'
import ServiceDetail from './components/sections/ServiceDetail'
import ContactPopup from './components/ui/Contactpopup'
import Admin from './pages/Admin/Admin'
import ServicesManager from './pages/Admin/ServicesManager'
import PortfolioManager from './pages/Admin/PortfolioManager'
import CareerManager from './pages/Admin/CareerManager'
import AdminLayout from './pages/Admin/AdminLayout'
import ScrollToTop from './components/ScrollToTop'
import ServiceForm from './pages/Admin/ServiceForm'
import ProjectForm from './pages/Admin/ProjectForm'
import CareerFrom from './pages/Admin/CareerFrom'
import ApplyPage from './components/ApplyPage'
import AdminApplicationsPage from './pages/Admin/AdminApplicationsPage'
import ContactPage from './pages/Admin/ContactPage'
import Login from './pages/Admin/Login'
import ProtectedRoute from './components/ProtectedRoute'
import CategoryManager from "./pages/Admin/CategoryManager";
import BlogManager from "./pages/Admin/BlogManager";
import BlogForm from "./pages/Admin/BlogForm";

function AppShell() {
  // useScrollReveal()
  // const location = useLocation()

  // useEffect(() => {
  //   const lenis = new Lenis({
  //     duration: 1.5,
  //     easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  //   })
  //   const raf = time => { lenis.raf(time); requestAnimationFrame(raf) }
  //   requestAnimationFrame(raf)
  //   window.scrollTo({ top: 0, behavior: 'instant' })
  //   return () => lenis.destroy()
  // }, [location.pathname])


  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin');

  // console.log(location.pathname)

  return (
    <>
      <CustomCursor />
      <ScrollToTop />

      {!isAdminRoute && <ContactPopup />}
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailPage />} />
        <Route path="/Apply" element={<ApplyPage />} />
        <Route path="/ServiceDetail/:id" element={<ServiceDetail />} />


        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >


          {/* <Route path="/admin" element={<AdminLayout />}> */}

          <Route path="/admin" element={<Admin />} />
          <Route path="dashboard" element={<Admin />} />


          <Route path="services" element={<ServicesManager />} />
          <Route path="services/create" element={<ServiceForm />} />
          <Route path="services/:id/edit" element={<ServiceForm />} />

          <Route path="categories" element={<CategoryManager />} />
          
          <Route path="blogs" element={<BlogManager />} />
          <Route path="blogs/create" element={<BlogForm />} />
          <Route path="blogs/:id/edit" element={<BlogForm />} />

          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="portfolio/create" element={<ProjectForm />} />
          <Route path="portfolio/:id/edit" element={<ProjectForm />} />


          <Route path="careers" element={<CareerManager />} />
          <Route path="careers/create" element={<CareerFrom />} />
          <Route path="careers/:id/edit" element={<CareerFrom />} />


          <Route path="ContactClient" element={<ContactPage />} />


          <Route path="ApplyCandidates" element={<AdminApplicationsPage />} />
        </Route>
      </Routes>

      <a
        href="https://wa.me/+919919888269"
        target="_blank" rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: 90, right: 32, zIndex: 989,
          width: 46, height: 46, borderRadius: '50%', background: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.5)',
          cursor: 'pointer', textDecoration: 'none',
          animation: 'waBulge 2s ease-in-out infinite',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.121 1.532 5.849L.057 23.571a.75.75 0 0 0 .92.921l5.42-1.463A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.5-5.207-1.378l-.374-.217-3.876 1.046 1.078-3.772-.235-.386A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      </a>

      {/* <ScrollToTop /> */}
      {/* <Footer /> */}
      {!isAdminRoute && <Footer />}

    </>
  )
}

export default function App() {
  return (
    <BrowserRouter >
      <AppShell />
    </BrowserRouter>
  )
}