import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaPinterestP, FaTiktok, FaWhatsapp, FaXTwitter, FaYoutube } from "react-icons/fa6";
import useAuth from "../context/AuthContext";

export default function Footer() {
  const { isLoggedIn, user } = useAuth();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <img src="/images/contact-hero-brand-mark.jpeg" alt="Pillar of EasyCure and Wellness Haven logo and full brand name" className="footer-logo" />
          <p>Nature Cares & Healthy Living.</p>
          <p className="footer-address">13, Uwumarongie Street, GRA, Benin City, Edo State, Nigeria</p>
        </div>

        <nav className="footer-links" aria-label="Explore EASYCURE">
          <h4>Explore</h4>
          <Link to="/collection">Shop Wellness Products</Link>
          <Link to="/testimonials">Testimonials</Link>
          <Link to="/outreach">Outreach Activities</Link>
          <Link to="/journey">Stories Journey</Link>
          <Link to="/our-director">Meet Our Director</Link>
        </nav>

        <nav className="footer-links" aria-label="Customer links">
          <h4>Customer Care</h4>
          <Link to="/dashboard">My Orders</Link>
          <Link to="/cart">Cart</Link>
          {isLoggedIn ? <>
            <Link to="/profile">My Profile</Link>
            {user?.distributorStatus === "approved" && <Link to="/distributor">Distributor Dashboard</Link>}
          </> : <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>}
          <Link to="/support">Support Guide</Link>
          <Link to="/how-to-use">How to Use EASYCURE</Link>
        </nav>

        <div className="footer-contact">
          <h4>Contact & Follow</h4>
          <a href="mailto:contact@pillarofeasycure.com">contact@pillarofeasycure.com</a>
          <a href="tel:+2348117240100">+2348117240100</a>
          <a href="https://wa.me/2348029778813" target="_blank" rel="noopener noreferrer">WhatsApp: +2348029778813</a>
          <a href="https://resyinpublications.com/" target="_blank" rel="noopener noreferrer">RESYIN for Readers</a>
          <a href="https://resyinpublications.com/" target="_blank" rel="noopener noreferrer">RESYIN for Writers</a>
          <nav className="footer-social" aria-label="Follow EASYCURE on social media">
            <a href="https://www.tiktok.com/@dr.easycure" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok size={22} /></a>
            <a href="https://www.facebook.com/share/1MeS6kTboc/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF size={22} /></a>
            <a href="https://www.instagram.com/dr.easycure?utm_source=qr&vrfl=NWM2cnF6N2JteG54" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={22} /></a>
            <a href="https://www.youtube.com/@YourHealthMyPrincipalPriority" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube size={24} /></a>
            <a href="https://x.com/DrEasycure" target="_blank" rel="noopener noreferrer" aria-label="X"><FaXTwitter size={20} /></a>
            <a href="https://www.pinterest.com/profclarae/?invite_code=e2c20c89dae04a88ad47f6324daf5f7d&sender=1014436022223794760" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><FaPinterestP size={22} /></a>
            <a href="https://wa.me/2348029778813" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp size={24} /></a>
          </nav>
        </div>
      </div>

      <div className="container footer-legal">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/refund-policy">Refund & Returns</Link>
        <Link to="/terms-conditions">Terms & Conditions</Link>
      </div>
      <div className="footer-bottom">(c) {new Date().getFullYear()} PILLAR OF EASYCURE AND WELLNESS HAVEN. All rights reserved.</div>
    </footer>
  );
}
