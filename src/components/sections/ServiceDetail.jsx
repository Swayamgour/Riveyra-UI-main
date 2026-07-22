import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


import { useParams } from "react-router-dom";
// import { AI_SERVICE_DATA } from "../data";
import { useGetServiceBySlugQuery } from "../../redux/api";
import Loader from "../Loader";
import SEO from "../SEO";






// ─── Styles ──────────────────────────────────────────────────────────────────

const STYLE = `
  .ai-detail-section {
    background: #050B18;
    position: relative;
    overflow-x: hidden;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }
  
  .ai-detail-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);
    background-size: 36px 36px;
    pointer-events: none;
  }
  
  .ai-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 80px 6% 96px;
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 1023px) {
    .ai-container { padding: 64px 6% 80px; }
  }
  @media (max-width: 767px) {
    .ai-container { padding: 60px 5% 72px; }
  }
  
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.15);
    padding: 8px 20px;
    border-radius: 40px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.7);
    cursor: pointer;
    margin-bottom: 48px;
    transition: all 0.3s ease;
  }
  
  .back-btn:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.3);
    color: #fff;
    transform: translateX(-4px);
  }
  
  /* Hero Section Enhanced Styles */
  .hero-section {
    text-align: center;
    margin-bottom: 80px;
  }
  
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(79, 142, 247, 0.1);
    border: 1px solid rgba(79, 142, 247, 0.2);
    padding: 6px 16px;
    border-radius: 40px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    color: #4F8EF7;
    margin-bottom: 24px;
  }
  
  .hero-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(36px, 8vw, 64px);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 24px;
    background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .hero-subtitle {
    font-size: 0.8em;
    display: block;
    color: #4F8EF7;
    background: none;
    -webkit-text-fill-color: #4F8EF7;
    margin-top: 8px;
  }
  
  .hero-intro {
    font-size: clamp(17px, 4.5vw, 20px);
    font-weight: 500;
    line-height: 1.5;
    color: #4F8EF7;
    max-width: 700px;
    margin: 24px auto 16px;
    letter-spacing: -0.2px;
  }
  
  .hero-description-wrapper {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .hero-desc {
    font-size: clamp(15px, 3.8vw, 17px);
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.65);
    margin: 12px auto;
    max-width: 750px;
  }
  
  .hero-desc:first-of-type {
    margin-top: 20px;
  }
  
  .hero-questions-wrapper {
    max-width: 600px;
    margin: 32px auto 24px;
    padding: 28px 32px;
    background: rgba(79, 142, 247, 0.05);
    border: 1px solid rgba(79, 142, 247, 0.2);
    border-radius: 24px;
    text-align: left;
  }
  
  .hero-questions-title {
    font-size: 18px;
    font-weight: 600;
    color: #4F8EF7;
    margin-bottom: 20px;
    text-align: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  
  .hero-questions-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .hero-questions-list li {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 0;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.85);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  
  .hero-questions-list li:last-child {
    border-bottom: none;
  }
  
  .question-icon {
    width: 20px;
    height: 20px;
    color: #4F8EF7;
    flex-shrink: 0;
  }
  
  .hero-closing {
    font-size: clamp(15px, 3.8vw, 17px);
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.7);
    margin: 16px auto 8px;
    max-width: 750px;
    font-weight: 500;
  }
  
  .hero-closing:last-of-type {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    .hero-questions-wrapper {
      padding: 20px 24px;
      margin: 24px auto;
    }
    
    .hero-questions-list li {
      font-size: 14px;
      padding: 10px 0;
    }
    
    .hero-questions-title {
      font-size: 16px;
    }
    
    .hero-intro {
      font-size: 18px;
    }
  }
  
  @media (max-width: 560px) {
    .hero-questions-wrapper {
      padding: 16px 20px;
    }
    
    .hero-questions-list li {
      font-size: 13px;
      gap: 10px;
    }
  }
  
  .content-block {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    margin-bottom: 100px;
  }
  
  .content-block.reverse {
    direction: rtl;
  }
  
  .content-block.reverse .block-content {
    direction: ltr;
  }
  
  @media (max-width: 900px) {
    .content-block {
      grid-template-columns: 1fr;
      gap: 40px;
      margin-bottom: 70px;
    }
    .content-block.reverse {
      direction: ltr;
    }
  }
  
  .block-content {
    direction: ltr;
  }
  
  .block-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    color: #4F8EF7;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: inline-block;
  }
  
  .block-label::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 1.5px;
    background: #4F8EF7;
    margin-right: 8px;
    vertical-align: middle;
  }
  
  .block-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: clamp(24px, 5vw, 36px);
    font-weight: 700;
    line-height: 1.3;
    margin: 0 0 20px;
    letter-spacing: -0.02em;
  }
  
  .block-desc {
    font-size: 15px;
    line-height: 1.7;
    color: rgba(255,255,255,0.7);
    margin-bottom: 24px;
  }
  
  .feature-list-sm {
    list-style: none;
    padding: 0;
    margin: 20px 0 0;
  }
  
  .feature-list-sm li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    font-size: 14px;
    color: rgba(255,255,255,0.8);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  
  .feature-list-sm li:last-child {
    border-bottom: none;
  }
  
  .check-icon {
    width: 18px;
    height: 18px;
    color: #4F8EF7;
    flex-shrink: 0;
  }
  
  .block-image {
    border-radius: 24px;
    overflow: hidden;
    position: relative;
  }
  
  .block-image img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 24px;
    transition: transform 0.5s ease;
  }
  
  .block-image:hover img {
    transform: scale(1.02);
  }
  
  .image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(79,142,247,0.1) 0%, transparent 100%);
    border-radius: 24px;
    pointer-events: none;
  }
  
  .example-box {
    background: rgba(79, 142, 247, 0.05);
    border-left: 3px solid #4F8EF7;
    padding: 20px 24px;
    margin-top: 24px;
    border-radius: 12px;
  }
  
  .example-box h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #4F8EF7;
  }
  
  .example-box p {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    line-height: 1.6;
    margin: 0;
    white-space: pre-line;
  }
  
  .comparison-section {
    margin: 80px 0;
    padding: 48px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 32px;
  }
  
  .comparison-title {
    text-align: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 40px;
  }
  
  .comparison-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  @media (max-width: 768px) {
    .comparison-grid {
      grid-template-columns: 1fr;
    }
    .comparison-section {
      padding: 32px 24px;
    }
  }
  
  .comparison-card {
    padding: 24px;
    background: rgba(255,255,255,0.02);
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.07);
  }
  
  .comparison-card h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #fff;
  }
  
  .comparison-card ul {
    list-style: none;
    padding: 0;
  }
  
  .comparison-card li {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 14px;
  }
  
  .comparison-card li span:first-child {
    color: rgba(255,255,255,0.6);
  }
  
  .comparison-card li span:last-child {
    color: #fff;
    font-weight: 500;
  }
  
  .badge-ai {
    background: rgba(79, 142, 247, 0.2);
    color: #4F8EF7;
    padding: 2px 8px;
    border-radius: 20px;
    font-size: 12px;
    margin-left: 8px;
  }
  
  .who-needs-section {
    margin: 80px 0;
    padding: 48px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 32px;
  }
  
  .who-needs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
  
  @media (max-width: 768px) {
    .who-needs-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .who-needs-section {
      padding: 32px 24px;
    }
  }
  
  .who-list {
    list-style: none;
    padding: 0;
  }
  
  .who-list li {
    padding: 12px 0;
    font-size: 14px;
    color: rgba(255,255,255,0.8);
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  
  /* Our Approach Section */
  .approach-section {
    margin: 80px 0;
    padding: 48px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 32px;
  }
  
  .approach-subtitle {
    text-align: center;
    color: rgba(255,255,255,0.6);
    font-size: 16px;
    margin-bottom: 48px;
  }
  
  .steps-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 48px;
  }
  
  @media (max-width: 900px) {
    .steps-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 560px) {
    .steps-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .step-card {
    text-align: center;
    padding: 32px 24px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 24px;
    transition: all 0.3s ease;
  }
  
  .step-card:hover {
    background: rgba(255,255,255,0.04);
    transform: translateY(-4px);
    border-color: rgba(79, 142, 247, 0.3);
  }
  
  .step-number {
    width: 56px;
    height: 56px;
    background: rgba(79, 142, 247, 0.1);
    border: 1px solid rgba(79, 142, 247, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 24px;
    font-weight: 700;
    color: #4F8EF7;
  }
  
  .step-card h4 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #fff;
  }
  
  .step-card p {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    line-height: 1.6;
    margin: 0;
  }
  
  .approach-why-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-top: 32px;
  }
  
  @media (max-width: 768px) {
    .approach-why-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .approach-why-card {
    padding: 24px;
    background: rgba(255,255,255,0.02);
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.07);
    transition: all 0.3s ease;
  }
  
  .approach-why-card:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(79, 142, 247, 0.3);
  }
  
  .approach-why-card h4 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #4F8EF7;
  }
  
  .approach-why-card p {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    line-height: 1.6;
    margin: 0;
  }
  
  .why-choose-section {
    margin: 80px 0;
    padding: 48px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 32px;
  }
  
  .why-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-top: 32px;
  }
  
  @media (max-width: 768px) {
    .why-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .why-card {
    padding: 20px;
    background: rgba(255,255,255,0.02);
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.07);
  }
  
  .why-card h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #4F8EF7;
  }
  
  .why-card p {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    line-height: 1.6;
    margin: 0;
  }
  
  .final-thoughts {
    margin: 60px 0;
    text-align: center;
    padding: 48px;
    background: linear-gradient(135deg, rgba(79, 142, 247, 0.05) 0%, transparent 100%);
    border-radius: 32px;
  }
  
  .final-thoughts h3 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 24px;
  }
  
  .final-thoughts p {
    font-size: 16px;
    color: rgba(255,255,255,0.7);
    line-height: 1.7;
    max-width: 700px;
    margin: 0 auto;
  }
  
  .faq-section {
    margin: 80px 0;
  }
  
  .faq-title {
    text-align: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 48px;
  }
  
  .faq-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    .faq-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .faq-item {
    padding: 24px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .faq-item:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(79, 142, 247, 0.3);
  }
  
  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
  }
  
  .faq-answer {
    margin-top: 16px;
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    line-height: 1.6;
    padding-top: 16px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }
  
  .cta-section {
    margin-top: 80px;
    text-align: center;
    padding: 64px 48px;
    background: linear-gradient(135deg, rgba(79, 142, 247, 0.08) 0%, rgba(79, 142, 247, 0.02) 100%);
    border: 1px solid rgba(79, 142, 247, 0.2);
    border-radius: 32px;
  }
  
  .cta-section h3 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 16px;
  }
  
  .cta-section p {
    color: rgba(255,255,255,0.6);
    margin-bottom: 32px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .cta-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }
  
  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: #4F8EF7;
    border: none;
    padding: 14px 36px;
    border-radius: 40px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .cta-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: transparent;
    border: 1px solid rgba(79, 142, 247, 0.5);
    padding: 14px 36px;
    border-radius: 40px;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 15px;
    color: #4F8EF7;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .cta-btn:hover {
    background: #3a7bdf;
    transform: translateY(-2px);
    gap: 16px;
  }
  
  .cta-btn-outline:hover {
    background: rgba(79, 142, 247, 0.1);
    transform: translateY(-2px);
    gap: 16px;
  }
  
  @media (max-width: 560px) {
    .cta-section { padding: 40px 24px; }
    .cta-section h3 { font-size: 24px; }
    .cta-buttons { flex-direction: column; align-items: center; }
  }
`;

if (typeof document !== 'undefined' && !document.getElementById('ai-detail-styles')) {
  const el = document.createElement('style');
  el.id = 'ai-detail-styles';
  el.textContent = STYLE;
  document.head.appendChild(el);
}

// ─── FAQ Data ──────────────────────────────────────────────────────────────────


export default function AIServiceDetail() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const { id } = useParams();
  // console.log(id)

  const { data, isLoading } = useGetServiceBySlugQuery(id)

  // console.log()

  const serviceData = data?.data
  // console.log(serviceData?.seo)

  let seo = serviceData?.seo

  const blocks = serviceData?.blocks;
  const steps = serviceData?.approach.steps;
  const whyChooseApproach = serviceData?.approach.whyChoose;
  const faqs = serviceData?.faq;


  if (isLoading) {
    return (
      <div style={{ padding: "100px" }}>
        <Loader />
      </div>
    );
  }
  if (!serviceData) {
    return (
      <div style={{ color: "#fff", padding: "100px", textAlign: "center" }}>
        Service not found
      </div>
    );
  }
  return (
    <>
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

      <section className="ai-detail-section">
        <div className="ai-container">

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button className="back-btn" onClick={() => navigate(-1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 12L6 8l4-4" />
              </svg>
              Back to Services
            </button>
          </motion.div>

          {/* Hero Section */}
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-section"
          >
            {/* <div className="hero-badge">
            <span>{serviceData.hero.badge}</span>
          </div> */}

            <h1 className="hero-title">
              {serviceData.hero.title}
              <br />
              <span className="hero-subtitle">
                {serviceData.hero.subtitle}
              </span>
            </h1>

            {/* Intro Line */}
            {serviceData.hero.intro && (
              <p className="hero-intro">{serviceData.hero.intro}</p>
            )}

            {/* Description Paragraphs */}
            <div className="hero-description-wrapper">
              {serviceData.hero.desc?.map((item, i) => (
                <p key={i} className="hero-desc">{item}</p>
              ))}
            </div>



            {/* Closing Paragraphs */}
            {serviceData.hero.closing?.map((c, i) => (
              <p key={i} className="hero-closing">{c}</p>
            ))}
          </motion.div>

          {/* Dynamic Content Blocks */}
          {blocks?.map((block, i) => {
            const isReverse = block.reverse || i % 2 !== 0;

            return (
              <motion.div
                key={i}
                className={`content-block ${isReverse ? "reverse" : ""}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                <div className="block-content">
                  <span className="block-label">{block.label}</span>
                  <h2 className="block-title">{block.title}</h2>

                  {block.desc && (
                    <p className="block-desc">{block.desc}</p>
                  )}

                  {block.extra && (
                    <p className="block-desc">{block.extra}</p>
                  )}

                  {block.features && (
                    <ul className="feature-list-sm">
                      {block.features.map((f, idx) => (
                        <li key={idx}>
                          <svg
                            className="check-icon"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M16 6L8 14L4 10" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  {block.example && (
                    <div className="example-box">
                      <h4>📌 Example You'll Relate To</h4>
                      <p style={{ whiteSpace: "pre-line" }}>
                        {block.example}
                      </p>
                    </div>
                  )}
                </div>

                <div className="block-image">
                  <img src={block.image} alt={block.alt} />
                  <div className="image-overlay"></div>
                </div>
              </motion.div>
            );
          })}

          {/* Comparison Table */}
          <motion.div
            className="comparison-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="comparison-title">
              {serviceData.comparison.title}
            </h3>

            <div className="comparison-grid">
              <div className="comparison-card">
                <h4>Traditional</h4>
                <ul>
                  {serviceData.comparison.data.map((item, i) => (
                    <li key={i}>
                      <span>{item.feature}</span>
                      <span>{item.traditional}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="comparison-card">
                <h4>AI <span className="badge-ai">Upgrade</span></h4>
                <ul>
                  {serviceData.comparison.data.map((item, i) => (
                    <li key={i}>
                      <span>{item.feature}</span>
                      <span>{item.ai}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '32px', color: '#4F8EF7', fontSize: '14px' }}>👉 This is why businesses are upgrading to AI-powered software solutions.</p>
          </motion.div>

          {/* Who Needs AI Services */}
          <motion.div
            className="who-needs-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="comparison-title">
              {serviceData.whoNeeds.title}
            </h3>

            <div className="who-needs-grid">
              {serviceData.whoNeeds.problems?.length !== 0 && <ul className="who-list">
                {serviceData.whoNeeds.problems.map((item, i) => (
                  <li key={i}>✔ {item}</li>
                ))}
              </ul>}

              {serviceData.whoNeeds.idealFor && (
                <ul className="who-list">
                  {serviceData.whoNeeds.idealFor.map((item, i) => (
                    <li key={i}>✔ {item}</li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>

          {/* Our Approach Section - NEW */}
          <motion.div
            className="approach-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="comparison-title">Our Approach</h3>
            <p className="approach-subtitle">Simple, Practical & Results-Focused — We don't overcomplicate things.</p>

            <div className="steps-grid">
              {steps?.map((step, idx) => (
                <motion.div
                  key={idx}
                  className="step-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="step-number">{step.number}</div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </motion.div>
              ))}
            </div>




            <p style={{ textAlign: 'center', marginTop: '32px', color: '#4F8EF7', fontSize: '14px' }}>
              And most importantly—we explain everything clearly.
            </p>
          </motion.div>

          {/* Why Choose Us Section (Original) - Keeping for consistency */}
          <motion.div
            className="why-choose-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="comparison-title">
              {serviceData.approach.title}
            </h3>

            <div className="why-grid">
              {whyChooseApproach?.map((item, i) => (
                <div key={i} className="why-card">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: '32px', color: 'rgba(255,255,255,0.8)' }}>And most importantly—we keep everything simple and transparent.</p>
          </motion.div>

          {/* Final Thoughts */}
          <motion.div
            className="final-thoughts"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Do You Really Need AI?</h3>
            <p>You don't need AI because it's trending. You need it if work feels repetitive, systems don't connect, or growth feels slow. AI doesn't replace your business—it strengthens it.</p>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="faq-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="faq-title">Frequently Asked Questions</h3>
            <div className="faq-grid">
              {faqs?.map((faq, idx) => (
                <div
                  key={idx}
                  className="faq-item"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <div className="faq-question">
                    <span>{faq.q}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                  {openFaq === idx && (
                    <div className="faq-answer">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="cta-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>{serviceData.cta.title}</h3>
            <p>{serviceData.cta.desc}</p>

            <div className="cta-buttons">
              {serviceData.cta.buttons.map((btn, i) => (
                <button
                  key={i}
                  className={i === 0 ? "cta-btn" : "cta-btn-outline"}
                  onClick={() => navigate(btn.link)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <p style={{ marginTop: '32px', fontSize: '14px', color: '#4F8EF7' }}>
              👉 Get custom AI software development services for small businesses | 👉 Automate operations and reduce workload | 👉 Improve customer experience with intelligent systems
            </p>
          </motion.div>

        </div>
      </section>
    </>
  );
}