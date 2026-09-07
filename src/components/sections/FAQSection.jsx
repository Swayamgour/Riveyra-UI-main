import React, { useState } from 'react';
import './FAQSection.css';

const DEFAULT_FAQS = [
  {
    question: "How long does it take to build a website?",
    answer: "The timeline depends on the complexity of the project. A standard corporate website typically takes 2 to 4 weeks, while complex web applications can take 2 to 4 months."
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer: "Yes, we offer comprehensive maintenance and support plans to ensure your website remains secure, up-to-date, and performs optimally."
  },
  {
    question: "Will my website be mobile-friendly and responsive?",
    answer: "Absolutely. All our websites are designed with a mobile-first approach, ensuring they look great and function perfectly on all devices, from smartphones to large desktop screens."
  },
  {
    question: "Do you help with SEO?",
    answer: "Yes, we build all our websites with technical SEO best practices in mind, including optimized site speed, clean code structure, and meta tags to help you rank higher on search engines."
  }
];

const FAQSection = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked <span className="text-gradient">Questions</span></h2>
          <p className="faq-subtitle">Got questions? We've got answers. Here are some of the most common inquiries we receive.</p>
        </div>

        <div className="faq-list">
          {(faqs || DEFAULT_FAQS).map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question-box">
                <h3 className="faq-question">{faq.question}</h3>
                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
              </div>
              <div className="faq-answer-wrapper" style={{ maxHeight: activeIndex === index ? '200px' : '0px' }}>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
