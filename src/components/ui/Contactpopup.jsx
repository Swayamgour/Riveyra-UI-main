import { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import { useCreateContactMutation } from "../../redux/api";

const ContactPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false)

  const [createContact] = useCreateContactMutation()


  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      sessionStorage.setItem("riveyra_popup_seen", "true");
    }, 400);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setIsSelectOpen(false) // 👈 close on change

    // 👉 Phone ke liye special handling
    if (name === "phone") {
      value = value.replace(/\D/g, ""); // only digits
      value = value.slice(0, 10);       // max 10 digits
    }

    setFormData({ ...formData, [name]: value });
  };






  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      // ✅ BACKEND API DATA
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
      };

      // ✅ YOUR BACKEND API HIT
      // change URL with your backend API
      await createContact(payload).unwrap();

      // ✅ WEB3FORMS DATA
      const submitData = new FormData();

      submitData.append(
        "access_key",
        "a4be4a17-c3f0-42e2-9ef2-3184e17f785a"
      );

      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("service", formData.service);
      submitData.append("message", formData.message);



      // ✅ WEB3FORMS HIT
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: submitData,
        }
      );

      const data = await response.json();

      if (data.success) {

        setSubmitted(true);

        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });

        setTimeout(() => {
          handleClose();
        }, 2500);

      } else {
        console.log("Error", data);
        alert("Failed to send message");
      }

    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        .riv-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: riv-overlay-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          cursor:pointer;
        }
        .riv-overlay.closing {
          animation: riv-overlay-out 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        @keyframes riv-overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes riv-overlay-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .riv-modal {
          position: relative;
          width: 100%;
          max-width: 520px;
          background: #0a0a0f;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          overflow: hidden;
          animation: riv-modal-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
        }
        .riv-modal.closing {
          animation: riv-modal-out 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        @keyframes riv-modal-in {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes riv-modal-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(20px) scale(0.97); }
        }

        .riv-glow-bar {
          height: 3px;
          background: linear-gradient(90deg, #6c63ff, #00d4ff, #6c63ff);
          background-size: 200% 100%;
          animation: riv-shimmer 2.5s linear infinite;
        }
        @keyframes riv-shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .riv-header {
          padding: 32px 36px 24px;
          position: relative;
        }
        .riv-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(108, 99, 255, 0.12);
          border: 1px solid rgba(108, 99, 255, 0.25);
          border-radius: 100px;
          padding: 4px 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #a09cff;
          margin-bottom: 14px;
        }
        .riv-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6c63ff;
          animation: riv-pulse 2s ease-in-out infinite;
        }
        @keyframes riv-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        .riv-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          margin: 0 0 6px;
          letter-spacing: -0.02em;
        }
        .riv-title span {
          background: linear-gradient(135deg, #6c63ff, #00d4ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .riv-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: rgba(255,255,255,0.42);
          font-weight: 300;
          margin: 0;
          line-height: 1.5;
        }

        .riv-close {
          position: absolute;
          top: 24px;
          right: 28px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 18px;
          line-height: 1;
        }
        .riv-close:hover {
          background: rgba(255, 80, 80, 0.15);
          border-color: rgba(255, 80, 80, 0.3);
          color: #ff6b6b;
          transform: rotate(90deg);
        }

        .riv-body {
          padding: 0 36px 32px;
        }

        .riv-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .riv-field {
          margin-bottom: 12px;
          position: relative;
        }
        .riv-field label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 6px;
          transition: color 0.2s;
        }
        .riv-field.active label {
          color: #6c63ff;
        }
        .riv-field input,
        .riv-field select,
        .riv-field textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #ffffff;
          outline: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          -webkit-appearance: none;
        }
        .riv-field input::placeholder,
        .riv-field textarea::placeholder {
          color: rgba(255,255,255,0.2);
        }
        .riv-field select option {
          background: #1a1a2e;
          color: #fff;
        }
        .riv-field input:focus,
        .riv-field select:focus,
        .riv-field textarea:focus {
          border-color: rgba(108, 99, 255, 0.5);
          background: rgba(108, 99, 255, 0.06);
          box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.08), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .riv-field textarea {
          resize: none;
          height: 80px;
        }

        .riv-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6c63ff, #5a54d4);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 6px;
          position: relative;
          overflow: hidden;
        }
        .riv-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .riv-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(108, 99, 255, 0.4);
        }
        .riv-submit:hover::before {
          opacity: 1;
        }
        .riv-submit:active {
          transform: translateY(0);
        }

        .riv-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent);
          margin: 0 0 24px;
        }

        .riv-success {
          padding: 48px 36px;
          text-align: center;
        }
        .riv-success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,212,255,0.15));
          border: 1px solid rgba(108,99,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 28px;
          animation: riv-success-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes riv-success-pop {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .riv-success h3 {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px;
        }
        .riv-success p {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.42);
          margin: 0;
        }

        @media (max-width: 480px) {
          .riv-modal { border-radius: 20px; }
          .riv-header { padding: 28px 24px 20px; }
          .riv-body { padding: 0 24px 28px; }
          .riv-title { font-size: 22px; }
          .riv-row { grid-template-columns: 1fr; }
          .riv-close { top: 18px; right: 18px; }
        }
      `}</style>

      <div
        className={`riv-overlay${isClosing ? " closing" : ""}`}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div className={`riv-modal${isClosing ? " closing" : ""}`}>
          <div className="riv-glow-bar" />

          {submitted ? (
            <div className="riv-success">
              <div className="riv-success-icon">✦</div>
              <h3>We'll be in touch!</h3>
              <p>Thank you for reaching out. Our team will contact you within 24 hours.</p>
            </div>
          ) : (
            <>
              <div className="riv-header">
                {/* <div className="riv-badge">
                  <span className="riv-badge-dot" />
                  Quick Connect
                </div> */}
                <h2 className="riv-title">
                  Contact Us
                </h2>
                {/* <p className="riv-subtitle">
                  Tell us about your project — we respond within 24 hours.
                </p> */}
                <button className="riv-close" onClick={handleClose} aria-label="Close">
                  ✕
                </button>
              </div>

              {/* <div className="riv-divider" /> */}

              <div className="riv-body">
                <form onSubmit={handleSubmit}>
                  <div className="riv-row">
                    <div className={`riv-field${focused === "name" ? " active" : ""}`}>
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused("")}
                        required
                      />
                    </div>
                    <div className={`riv-field${focused === "phone" ? " active" : ""}`}>
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocused("phone")}
                        onBlur={() => setFocused("")}
                      />
                    </div>
                  </div>

                  <div className={`riv-field${focused === "email" ? " active" : ""}`}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused("")}
                      required
                    />
                  </div>

                  <div className={`riv-field ${focused === "service" ? "active" : ""}`}>
                    <label>Service Needed</label>

                    <div className="select-wrapper">
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        onFocus={() => {
                          setFocused("service")
                          setIsSelectOpen(true)   // 👈 open
                        }}
                        onBlur={() => {
                          setFocused("")
                          setIsSelectOpen(false)  // 👈 close
                        }}
                      >
                        <option value="" disabled>Select a service...</option>
                        <option value="web">Web Development</option>
                        <option value="app">Mobile App Development</option>
                        <option value="ui">UI/UX Design</option>
                        <option value="cloud">Cloud Solutions</option>
                        <option value="ai">AI / ML Solutions</option>
                        <option value="other">Other</option>
                      </select>

                      {/* Icon */}
                      {/* <span className="select-icon">▼</span> */}
                      <span className={`select-icon ${isSelectOpen ? "open" : ""}`}>
                        ▼
                      </span>
                    </div>
                  </div>

                  <div className={`riv-field${focused === "message" ? " active" : ""}`}>
                    <label>Brief Message</label>
                    <textarea
                      name="message"
                      placeholder="Tell us briefly about your project..."
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused("")}
                    />
                  </div>

                  <button type="submit" className="riv-submit">
                    Send Enquiry →
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ContactPopup;