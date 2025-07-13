// components/Footer.jsx
import './Footer.css';

const Footer = () => {
  return (
    <footer className="eventnest-footer">
      <div className="footer-top">
        <div className="footer-links">
          <a href="/manage" className="footer-link">Management</a>
          <a href="https://forms.gle/your-feedback-form-link" target="_blank" rel="noreferrer" className="footer-link">Feedback</a>
        </div>
        <div className="footer-socials">
          <a href="https://instagram.com/eventnest" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://linkedin.com/company/eventnest" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} EventNest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
