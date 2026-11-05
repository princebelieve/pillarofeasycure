import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Sprout, Users, ArrowRight, Handshake, Truck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import ServicePromoCarousel from "../components/ServicePromoCarousel";
import PostShareButton from "../components/PostShareButton";
import { getProducts, getTestimonials } from "../services/api";
import relativeDateTime from "../utils/relativeDateTime";
import useScrollReveal from "../hooks/useScrollReveal";
import { getVideoEmbedUrl } from "../utils/videoEmbed";
import useAuth from "../context/AuthContext";

const pillars = [
  { icon: Sprout, title: "Naturopathic Wellness", text: "Natural solutions for a healthier, longer, and vibrant life." },
  { icon: Users, title: "Naturopathic Equipment", text: "High-quality wellness equipment for home use and professional care." },
  { icon: ArrowRight, title: "Community Outreach", text: "Learn, serve, and create meaningful community impact." },
];


export default function Home() {
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  useScrollReveal();


  useEffect(() => {
    getProducts().then((data) => setProducts(Array.isArray(data) ? data.filter((p) => p.featured).slice(0, 4) : [])).catch(() => setProducts([]));
    getTestimonials(true).then((data) => setTestimonials(Array.isArray(data) ? data.map((item) => ({ ...item, videoFile: item.videoFile || item.video || "", audioFile: item.audioFile || item.audio || "" })).slice(0, 3) : [])).catch(() => setTestimonials([]));
  }, []);

  return (
    <>
      <Navbar />
      <main className="easy-life-home ec-home">
        <section className="ec-hero">
          <div className="container ec-hero-grid">
            <div className="ec-hero-copy">
              <p className="ec-kicker"><Sprout size={16} /> PILLAR OF EASYCURE & WELLNESS HAVEN</p>
              <h1>A little care.<br /><em>A healthier everyday.</em></h1>
              <p className="ec-hero-description">Make room for your wellbeing. Discover natural wellness products, thoughtful guidance, and a team ready to help you find your way.</p>
              <div className="easy-actions"><Link className="easy-btn easy-btn-primary" to="/collection">Explore the wellness shop <ArrowRight size={18} /></Link><Link className="easy-btn easy-btn-light" to="/about">Get to know EasyCure</Link></div>
              <div className="ec-hero-note"><Truck size={20} /><span><strong>Pay on delivery available</strong> ? Choose your payment option at checkout.</span></div>
            </div>
            <div className="ec-hero-visual"><img src="/images/easycure-wellness.jpg" alt="Herbal tea, aloe, and botanical ingredients in a bright wellness setting" fetchPriority="high" /><div className="ec-image-note"><Sprout size={24} /><div><strong>Rooted in nature.</strong><span>Made for your everyday.</span></div></div><span className="ec-visual-tag">YOUR WELLNESS HAVEN</span></div>
          </div>
        </section>
        <div className="ec-care-strip"><div className="container"><span><Sprout size={18} /> Natural wellness products</span><span><HeartPulse size={18} /> Thoughtful customer support</span><span><Truck size={18} /> Delivery & pickup options</span></div></div>

        <ServicePromoCarousel />

        <section className="director-home-feature"><div className="container director-home-feature-grid"><div className="director-home-portrait"><span>MEET OUR DIRECTOR</span><img src="/logo.png" alt="Pillar of EasyCure and Wellness Haven logo" /></div><div className="director-home-copy"><p className="easy-eyebrow">LEADERSHIP WITH HEART</p><h2>Meet Professor Clara Obehi Egonmwan.</h2><p>Professor Clara Obehi Egonmwan leads Pillar of EasyCure and Wellness Haven. With her team, she brings wellness products, product guidance, and community support together in one place.</p><Link to="/our-director" className="easy-btn easy-btn-primary">Meet our Director <ArrowRight size={18} /></Link></div></div></section>

        <section className="easy-intro section reveal">
          <div className="container easy-intro-grid">
            <p className="easy-eyebrow">WELCOME TO EASYCURE</p>
            <div><h2>Wellbeing begins with feeling supported.</h2><p>Pillar of EasyCure and Wellness Haven offers wellness products and support for healthier everyday living. Explore our collection and contact us for product and order enquiries.</p><img className="easy-inline-image" src="/images/easycure-community.jpg" alt="Illustration of a welcoming conversation about everyday wellbeing" loading="lazy" /></div>
          </div>
        </section>

        <section className="section easy-pillars reveal">
          <div className="container"><div className="easy-section-heading"><p className="easy-eyebrow">OUR CORE AREAS</p><h2>Care that fits into your life.</h2></div><div className="easy-pillar-grid">{pillars.map(({ icon: Icon, title, text }) => <article key={title} className="easy-pillar content-card"><Icon size={28} /><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <section className="section easy-products reveal"><div className="container"><div className="easy-section-heading easy-heading-row"><div><p className="easy-eyebrow">NATUROPATHIC WELLNESS</p><h2>Find your everyday essentials.</h2><p className="easy-products-intro">These featured products and more, are available to purchase from PILLAR OF EASYCURE AND WELLNESS HAVEN. Open any product to view its description, price, availability, and ordering options.</p></div><Link to="/collection" className="easy-text-link">Explore products <ArrowRight size={17} /></Link></div>{products.length ? <ProductGrid products={products} /> : <div className="easy-empty"><Sprout size={30} /><p>Our wellness product collection is being prepared. Please check back soon.</p></div>}</div></section>


        {testimonials.length > 0 && <section className="section testimonials-showcase reveal"><div className="container"><div className="easy-section-heading easy-heading-row"><div><p className="easy-eyebrow">COMMUNITY STORIES</p><h2>See how the EASYCURE community is growing.</h2></div><Link className="easy-text-link" to="/testimonials">View all stories <ArrowRight size={17} /></Link></div><div className="testimonial-home-grid">{testimonials.map((item) => { const embedUrl = getVideoEmbedUrl(item.videoUrl); const isVideoStory = Boolean(item.videoFile || embedUrl); return <article className={`testimonial-home-card content-card${isVideoStory ? " video-story-card" : ""}`} key={item._id}>{(item.videoFile || item.audioFile || embedUrl || item.image) && <div className="testimonial-home-media">{item.videoFile ? <video controls preload={item.image ? "none" : "metadata"} poster={item.image || undefined} src={item.videoFile} /> : item.audioFile ? <audio controls preload="metadata" src={item.audioFile} /> : embedUrl ? <iframe title={`${item.name} testimonial video`} src={embedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <img src={item.image} alt={item.name} />}</div>}<div className="testimonial-home-body">{item.createdAt && <small className="testimonial-date">Uploaded {relativeDateTime(item.createdAt)}</small>}{item.updatedAt && item.updatedAt !== item.createdAt && <small className="testimonial-date">Updated {relativeDateTime(item.updatedAt)}</small>}{isVideoStory && item.title && <h3 className="video-story-title">{item.title}</h3>}<p>“{item.testimony}”</p><strong>{item.name}</strong>{item.role && <span>{item.role}</span>}<PostShareButton title={item.title || item.name} text={item.testimony} url={`${window.location.origin}/testimonials#${item._id}`} /></div></article>; })}</div></div></section>}

        <section className="easy-membership"><div className="container easy-membership-grid"><div><p className="easy-eyebrow">YOUR EASYCURE ACCOUNT</p><h2>Your wellness shopping, in one place.</h2><p>Create an account to manage your orders, keep your details up to date, and get support from the EasyCure team.</p></div><div className="easy-member-card content-card"><strong>With your account, you can</strong><ul><li>View your orders and delivery updates</li><li>Upload payment receipts when required</li><li>Manage your profile and contact details</li><li>Apply to become a distributor</li></ul><Link to={isLoggedIn ? "/dashboard" : "/register"} className="easy-btn easy-btn-light breathing-button">{isLoggedIn ? "Open your dashboard" : "Create an account"}</Link></div></div></section>

        <section className="section easy-outreach reveal"><div className="container easy-three-column"><img className="easy-section-image" src="/images/easycure-community.jpg" alt="Illustrative Nigerian community wellness scene" loading="lazy" /><div><p className="easy-eyebrow">OUTREACH & PARTNERSHIPS</p><h2>Growing healthier, stronger communities together.</h2><p>We welcome wellness companies, schools, churches, NGOs, corporate organizations and community associations that want to showcase products or discuss meaningful local partnerships.</p><Link to="/contact" className="easy-text-link">Discuss a partnership <Handshake size={18} /></Link></div><div className="easy-outreach-mark content-card"><HeartPulse size={48} /><span>COMMUNITY<br />IMPACT</span></div></div></section>

        <section className="easy-closing reveal"><div className="container"><p className="easy-eyebrow">A LITTLE CARE GOES A LONG WAY</p><h2>Your next step to feeling supported.</h2><p className="easy-closing-copy">Explore our products, ask a question, or simply get to know us. Your wellness journey is welcome here.</p><div className="easy-actions"><Link className="easy-btn easy-btn-primary breathing-button" to={isLoggedIn ? "/dashboard" : "/register"}>{isLoggedIn ? "Go to your dashboard" : "Join the community"}</Link><Link className="easy-btn easy-btn-light breathing-button" to="/contact">Contact EASYCURE</Link></div></div></section>
      </main>
      <Footer />
    </>
  );
}
