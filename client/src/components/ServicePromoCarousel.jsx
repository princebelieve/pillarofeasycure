import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const promotions = [
  { label: "PILLAR OF EASYCURE", title: "A haven for your everyday wellbeing.", text: "Explore wellness products, product guidance, and community support.", image: "/wellness.jpeg", to: "/collection", destination: "pillarofeasycure.com/collection", action: "Shop wellness products" },
  { label: "GROW WITH EASYCURE", title: "Become an EasyCure Distributor", text: "Buy selected products at distributor prices and manage your own stock and customer orders.", image: "/wellness.jpeg", to: "/dashboard?distributor=apply", destination: "Apply in your EasyCure account", action: "Explore the opportunity" },
  { label: "RESYIN PUBLICATIONS · FOR READERS", title: "Find your next great read.", text: "Visit the RESYIN Publications online bookstore and explore books for your reading journey.", image: "/logo.png", to: "https://resyinpublications.com/", destination: "resyinpublications.com", action: "Explore the bookstore" },
  { label: "RESYIN PUBLICATIONS · FOR WRITERS", title: "Every writer has a story to share.", text: "Visit RESYIN Publications to connect with the team and enquire about your writing and publishing journey.", image: "/logo.png", to: "https://resyinpublications.com/", destination: "resyinpublications.com", action: "Connect with RESYIN" },
];

export default function ServicePromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const promotion = promotions[activeIndex];
  useEffect(() => {
    promotions.forEach(({ image }) => { const preload = new Image(); preload.src = image; });
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % promotions.length), 5500);
    return () => window.clearInterval(timer);
  }, []);
  const previous = () => setActiveIndex((index) => (index - 1 + promotions.length) % promotions.length);
  const next = () => setActiveIndex((index) => (index + 1) % promotions.length);
  const action = promotion.to.startsWith("http") ? <a className="easy-btn easy-btn-primary breathing-button" href={promotion.to} target="_blank" rel="noopener noreferrer">{promotion.action} <ArrowRight size={17} /></a> : <Link className="easy-btn easy-btn-primary breathing-button" to={promotion.to}>{promotion.action} <ArrowRight size={17} /></Link>;
  return <section className="service-promo-section reveal" aria-label="EASYCURE services"><div className="container"><div className="service-promo-carousel"><article className="service-promo service-promo-slide" key={promotion.label}><img className={promotion.imageClass} src={promotion.image} alt="" aria-hidden="true" /><div className="service-promo-overlay" /><div className="service-promo-content"><span className="service-promo-kicker">FEATURED ADVERT</span><span className="service-promo-label">{promotion.label}</span><h2>{promotion.title}</h2><p>{promotion.text}</p><strong className="service-promo-destination">{promotion.destination}</strong>{action}</div><div className="service-promo-controls"><button type="button" onClick={previous} aria-label="Previous advert"><ArrowLeft size={17} /></button><div className="service-promo-dots" aria-label="Choose advert">{promotions.map((item, index) => <button key={item.label} type="button" className={index === activeIndex ? "active" : ""} onClick={() => setActiveIndex(index)} aria-label={`Show ${item.title}`} />)}</div><button type="button" onClick={next} aria-label="Next advert"><ArrowRight size={17} /></button></div></article></div></div></section>;
}
