import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Sprout, Users, ArrowLeft, ArrowRight, Handshake, Truck } from "lucide-react";
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

const wellnessGallery = [
  { image: "/images/herbal-garden.jpeg", title: "A garden of wellness plants", alt: "A sunlit garden with labelled medicinal plants and aloe vera" },
  { image: "/images/hibiscus-herbal-ingredients.jpeg", title: "Botanicals in everyday life", alt: "Hibiscus, citrus and botanical ingredients arranged outdoors" },
  { image: "/images/ashwagandha-root.jpeg", title: "Rooted in nature", alt: "Ashwagandha roots growing beneath flowering plants" },
  { image: "/images/cinchona-botanical-illustration.jpeg", title: "Botanical field notes", alt: "Botanical illustration of a flowering cinchona tree and bark" },
  { image: "/images/st-johns-wort-flowers.jpeg", title: "Flowers in the garden", alt: "Yellow St John’s wort flowers growing among green leaves" },
  { image: "/images/grapefruit.jpeg", title: "Fresh citrus", alt: "Whole and sliced grapefruit" },
  { image: "/images/garlic.jpeg", title: "Everyday ingredients", alt: "Fresh garlic bulbs" },
  { image: "/images/ginkgo-leaves.jpeg", title: "A closer look at leaves", alt: "Green ginkgo leaves in soft natural light" },
  { image: "/images/wellness-treatment-room.jpeg", title: "A calm place to care for yourself", alt: "A peaceful wellness treatment room surrounded by greenery" },
  { image: "/images/essential-oil-set.jpeg", title: "Essential oils and herbs", alt: "Eucalyptus, peppermint and rosemary essential oil bottles with fresh herbs" },
];

const heroSlides = [
  {
    image: "/images/herbal-garden.jpeg",
    alt: "A sunlit garden with labelled medicinal plants and aloe vera",
    kicker: "PILLAR OF EASYCURE & WELLNESS HAVEN",
    title: "A little care.",
    emphasis: "A healthier YOU everyday.",
    description: "Explore nature-inspired wellness products, thoughtful guidance, and support for everyday wellbeing.",
    primary: "Explore the wellness shop",
    primaryTo: "/collection",
    secondary: "Get to know EasyCure",
    secondaryTo: "/about",
  },
  {
    image: "/images/hibiscus-herbal-ingredients.jpeg",
    alt: "Hibiscus, citrus and botanical ingredients arranged outdoors",
    kicker: "NATURAL WELLNESS, MADE PERSONAL",
    title: "Make space for", emphasis: "everyday wellbeing.",
    description: "Browse wellness essentials and learn about options that may fit your routine.",
    primary: "Browse wellness products", primaryTo: "/collection",
    secondary: "Contact our team", secondaryTo: "/contact",
  },
  {
    image: "/images/ashwagandha-root.jpeg",
    alt: "Ashwagandha roots growing beneath flowering plants",
    kicker: "WELLNESS STARTS WITH KNOWLEDGE",
    title: "Learn more.", emphasis: "Choose with care.",
    description: "Explore product information and reach out when you need help with your questions.",
    primary: "Meet our founder", primaryTo: "/our-director",
    secondary: "Explore our story", secondaryTo: "/about",
  },
  {
    image: "/images/wellness-treatment-room.jpeg",
    alt: "A peaceful wellness treatment room surrounded by greenery",
    kicker: "THOUGHTFUL SUPPORT FOR YOU",
    title: "Your next step.", emphasis: "At your own pace.",
    description: "Our team is here to help with product, order, delivery and general enquiries.",
    primary: "Ask us a question", primaryTo: "/contact",
    secondary: "Explore products", secondaryTo: "/collection",
  },
  {
    image: "/images/essential-oil-set.jpeg",
    alt: "Eucalyptus, peppermint and rosemary oils with fresh herbs",
    kicker: "FIND YOUR EVERYDAY ESSENTIALS",
    title: "Discover the collection.", emphasis: "Explore with care.",
    description: "Take a look through the wellness shop and find details for the products you are interested in.",
    primary: "Visit the wellness shop", primaryTo: "/collection",
    secondary: "Get in touch", secondaryTo: "/contact",
  },
  {
    image: "/images/cinchona-botanical-illustration.jpeg",
    alt: "Botanical illustration of a flowering cinchona tree and bark",
    kicker: "A WELLNESS JOURNEY BEGINS WITH A QUESTION",
    title: "Knowledge and care.", emphasis: "Here for your journey.",
    description: "Get to know Pillar of Easycure and Wellness Haven, our approach, and the support we offer.",
    primary: "Learn about EasyCure", primaryTo: "/about",
    secondary: "Contact our team", secondaryTo: "/contact",
  },
];


export default function Home() {
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const activeHeroSlide = heroSlides[activeHeroIndex];
  const showHeroSlide = (index) => setActiveHeroIndex((index + heroSlides.length) % heroSlides.length);
  useScrollReveal();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 9000);
    return () => window.clearInterval(timer);
  }, [activeHeroIndex]);

  useEffect(() => {
    getProducts().then((data) => setProducts(Array.isArray(data) ? data.filter((p) => p.featured).slice(0, 4) : [])).catch(() => setProducts([]));
    getTestimonials(true).then((data) => setTestimonials(Array.isArray(data) ? data.map((item) => ({ ...item, videoFile: item.videoFile || item.video || "", audioFile: item.audioFile || item.audio || "" })).slice(0, 3) : [])).catch(() => setTestimonials([]));
  }, []);

  return (
    <>
      <Navbar />
      <main className="ec-home">
        <section className="ec-hero">
          <div className="container ec-hero-grid">
            <div className="ec-hero-copy" key={activeHeroIndex}>
              <p className="ec-kicker"><Sprout size={16} /> {activeHeroSlide.kicker}</p>
              <h1>{activeHeroSlide.title}<br /><em>{activeHeroSlide.emphasis}</em></h1>
              <p className="ec-hero-description">{activeHeroSlide.description}</p>
              <div className="easy-actions"><Link className="easy-btn easy-btn-primary" to={activeHeroSlide.primaryTo}>{activeHeroSlide.primary} <ArrowRight size={18} /></Link><Link className="easy-btn easy-btn-light" to={activeHeroSlide.secondaryTo}>{activeHeroSlide.secondary}</Link></div>
              <div className="ec-hero-note"><Truck size={20} /><span><strong>Pay on delivery available</strong> ? Choose your payment option at checkout.</span></div>
            </div>
            <div className="ec-hero-visual" role="group" aria-roledescription="carousel" aria-label="Wellness images">
              <img key={activeHeroSlide.image} src={activeHeroSlide.image} alt={activeHeroSlide.alt} fetchPriority={activeHeroIndex === 0 ? "high" : "auto"} />
              <div className="ec-image-note"><Sprout size={24} /><div><strong>Rooted in nature.</strong><span>Made for your everyday.</span></div></div>
              <span className="ec-visual-tag">YOUR WELLNESS HAVEN</span>
              <div className="ec-hero-carousel-controls" role="group" aria-label="Hero carousel controls">
                <button type="button" onClick={() => showHeroSlide(activeHeroIndex - 1)} aria-label="Previous hero image"><ArrowLeft size={17} /></button>
                <div className="ec-hero-carousel-dots" role="group" aria-label="Choose a hero image">
                  {heroSlides.map((slide, index) => <button key={slide.image} type="button" className={index === activeHeroIndex ? "active" : ""} onClick={() => showHeroSlide(index)} aria-label={`Show hero image ${index + 1}`} aria-pressed={index === activeHeroIndex} />)}
                </div>
                <button type="button" onClick={() => showHeroSlide(activeHeroIndex + 1)} aria-label="Next hero image"><ArrowRight size={17} /></button>
              </div>
            </div>
          </div>
        </section>
        <div className="ec-care-strip"><div className="container"><span><Sprout size={18} /> Natural wellness products</span><span><HeartPulse size={18} /> Thoughtful customer support</span><span><Truck size={18} /> Delivery & pickup options</span></div></div>

        <ServicePromoCarousel />

        <section className="ec-wellness-gallery section reveal" aria-labelledby="ec-gallery-title"><div className="container"><div className="easy-section-heading easy-heading-row"><div><p className="easy-eyebrow">INSPIRED BY NATURE</p><h2 id="ec-gallery-title">Explore the world of natural wellness.</h2><p>Discover botanical ingredients, wellness spaces and learning resources that inspire a thoughtful approach to everyday wellbeing.</p></div><div className="ec-gallery-controls"><button type="button" aria-label="Scroll wellness gallery left" onClick={() => document.getElementById("ec-gallery-track")?.scrollBy({ left: -320, behavior: "smooth" })}>‹</button><button type="button" aria-label="Scroll wellness gallery right" onClick={() => document.getElementById("ec-gallery-track")?.scrollBy({ left: 320, behavior: "smooth" })}>›</button></div></div><div className="ec-gallery-track" id="ec-gallery-track" tabIndex="0" aria-label="Wellness inspiration images">{wellnessGallery.map((item, index) => <article className="ec-gallery-card content-card" key={item.image} style={{ "--gallery-index": index }}><img src={item.image} alt={item.alt} loading="lazy" /><div><span>WELLNESS INSPIRATION</span><h3>{item.title}</h3></div></article>)}</div></div></section>

        <section className="director-home-feature"><div className="container director-home-feature-grid"><div className="director-home-portrait"><span>MEET OUR FOUNDER</span><img src="/images/founder-clara-egonmwan-portrait.jpg" alt="Portrait of Professor Clara Obehi Egonmwan" /></div><div className="ec-founder-copy"><div className="director-home-copy"><p className="easy-eyebrow">LEADERSHIP WITH HEART</p><h2>Meet Professor Clara Obehi Egonmwan.</h2><p>A Professor of Agricultural Extension and Rural Development, Clara brings academic knowledge, natural health education and over a decade of practical wellness experience to Pillar of Easycare and Wellness Haven.</p><Link to="/our-director" className="easy-btn easy-btn-primary">Read the founder’s message <ArrowRight size={18} /></Link></div><img className="ec-founder-environment" src="/images/wellness-treatment-room.jpeg" alt="A calm wellness treatment room surrounded by greenery" loading="lazy" /></div></div></section>

        <section className="easy-intro section reveal">
          <div className="container easy-intro-grid">
            <p className="easy-eyebrow">WELCOME TO EASYCURE</p>
            <div><h2>Wellbeing begins with feeling supported.</h2><p>Pillar of Easycare and Wellness Haven offers wellness products and support for healthier everyday living. Explore our collection and contact us for product and order enquiries.</p><img className="easy-inline-image" src="/images/founder-community-consultation.jpg" alt="Professor Clara speaking with a community member during a wellness outreach" loading="lazy" /></div>
          </div>
        </section>

        <section className="section easy-pillars reveal">
          <div className="container"><div className="easy-section-heading"><p className="easy-eyebrow">OUR CORE AREAS</p><h2>Care that fits into your life.</h2></div><div className="easy-pillar-grid">{pillars.map(({ icon: Icon, title, text }) => <article key={title} className="easy-pillar content-card"><Icon size={28} /><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        <section className="section easy-products reveal"><div className="container"><div className="easy-section-heading easy-heading-row"><div><p className="easy-eyebrow">NATUROPATHIC WELLNESS</p><h2>Find your everyday essentials.</h2><p className="easy-products-intro">These featured products and more, are available to purchase from PILLAR OF EASYCURE AND WELLNESS HAVEN. Open any product to view its description, price, availability, and ordering options.</p></div><Link to="/collection" className="easy-text-link">Explore products <ArrowRight size={17} /></Link></div>{products.length ? <ProductGrid products={products} /> : <div className="easy-empty"><Sprout size={30} /><p>Our wellness product collection is being prepared. Please check back soon.</p></div>}</div></section>


        {testimonials.length > 0 && <section className="section testimonials-showcase reveal"><div className="container"><div className="easy-section-heading easy-heading-row"><div><p className="easy-eyebrow">COMMUNITY STORIES</p><h2>See how the EASYCURE community is growing.</h2></div><Link className="easy-text-link" to="/testimonials">View all stories <ArrowRight size={17} /></Link></div><div className="testimonial-home-grid">{testimonials.map((item) => { const embedUrl = getVideoEmbedUrl(item.videoUrl); const isVideoStory = Boolean(item.videoFile || embedUrl); return <article className={`testimonial-home-card content-card${isVideoStory ? " video-story-card" : ""}`} key={item._id}>{(item.videoFile || item.audioFile || embedUrl || item.image) && <div className="testimonial-home-media">{item.videoFile ? <video controls preload={item.image ? "none" : "metadata"} poster={item.image || undefined} src={item.videoFile} /> : item.audioFile ? <audio controls preload="metadata" src={item.audioFile} /> : embedUrl ? <iframe title={`${item.name} testimonial video`} src={embedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <img src={item.image} alt={item.name} />}</div>}<div className="testimonial-home-body">{item.createdAt && <small className="testimonial-date">Uploaded {relativeDateTime(item.createdAt)}</small>}{item.updatedAt && item.updatedAt !== item.createdAt && <small className="testimonial-date">Updated {relativeDateTime(item.updatedAt)}</small>}{isVideoStory && item.title && <h3 className="video-story-title">{item.title}</h3>}<p>“{item.testimony}”</p><strong>{item.name}</strong>{item.role && <span>{item.role}</span>}<PostShareButton title={item.title || item.name} text={item.testimony} url={`${window.location.origin}/testimonials#${item._id}`} /></div></article>; })}</div></div></section>}

        <section className="easy-membership"><div className="container easy-membership-grid"><div><p className="easy-eyebrow">YOUR EASYCURE ACCOUNT</p><h2>Your wellness shopping, in one place.</h2><p>Create an account to manage your orders, keep your details up to date, and get support from the EasyCure team.</p></div><div className="easy-member-card content-card"><strong>With your account, you can</strong><ul><li>View your orders and delivery updates</li><li>Upload payment receipts when required</li><li>Manage your profile and contact details</li><li>Apply to become a distributor</li></ul><Link to={isLoggedIn ? "/dashboard" : "/register"} className="easy-btn easy-btn-light breathing-button">{isLoggedIn ? "Open your dashboard" : "Create an account"}</Link></div></div></section>

        <section className="section easy-outreach reveal"><div className="container easy-three-column"><img className="easy-section-image" src="/images/community-wellness-outreach.jpg" alt="Community members gathered at a wellness outreach event" loading="lazy" /><div><p className="easy-eyebrow">OUTREACH & PARTNERSHIPS</p><h2>Growing healthier, stronger communities together.</h2><p>We welcome wellness companies, schools, churches, NGOs, corporate organizations and community associations that want to showcase products or discuss meaningful local partnerships.</p><Link to="/contact" className="easy-text-link">Discuss a partnership <Handshake size={18} /></Link></div><div className="easy-outreach-mark content-card"><HeartPulse size={48} /><span>COMMUNITY<br />IMPACT</span></div></div></section>

        <section className="easy-closing reveal"><div className="container"><p className="easy-eyebrow">A LITTLE CARE GOES A LONG WAY</p><h2>Your next step to feeling supported.</h2><p className="easy-closing-copy">Explore our products, ask a question, or simply get to know us. Your wellness journey is welcome here.</p><div className="easy-actions"><Link className="easy-btn easy-btn-primary breathing-button" to={isLoggedIn ? "/dashboard" : "/register"}>{isLoggedIn ? "Go to your dashboard" : "Join the community"}</Link><Link className="easy-btn easy-btn-light breathing-button" to="/contact">Contact EASYCURE</Link></div></div></section>
      </main>
      <Footer />
    </>
  );
}
