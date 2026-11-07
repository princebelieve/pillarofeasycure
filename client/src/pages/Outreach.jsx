import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useScrollReveal from "../hooks/useScrollReveal";
import { ArrowRight, HeartHandshake, Users } from "lucide-react";

const activities = [
  { title: "Community wellness education", text: "Professor Clara and the EasyCure team share natural wellness information and practical guidance with community members.", image: "/images/founder-community-wellness-session.jpg", alt: "Professor Clara speaking with a community member at a wellness education session" },
  { title: "Individual wellness consultations", text: "The supplied photos show Professor Clara meeting with individuals and explaining wellness information in a one-to-one setting.", image: "/images/founder-wellness-consultation.jpg", alt: "Professor Clara discussing wellness information with a visitor" },
  { title: "Community engagement", text: "In community settings, the team makes time for conversation, listening and sharing wellness knowledge with local residents.", image: "/images/community-wellness-outreach.jpg", alt: "Community members gathered at a wellness outreach event" },
];

export default function Outreach() {
  useScrollReveal();
  return <><Navbar /><main className="outreach-page"><section className="outreach-hero reveal"><div className="container outreach-hero-grid"><div><span className="eyebrow">EASYCURE COMMUNITY IMPACT</span><h1>Wellness education in the community.</h1><p>These moments from Professor Clara’s supplied photos show community conversations, wellness education and individual consultations in practice.</p><div className="easy-actions"><Link className="easy-btn easy-btn-primary breathing-button" to="/contact">Plan an outreach <ArrowRight size={18} /></Link><Link className="easy-btn easy-btn-light breathing-button" to="/testimonials">See community stories</Link></div></div><img className="breathing-image" src="/images/founder-community-consultation.jpg" alt="Professor Clara speaking with a community member during a wellness outreach" /></div></section><section className="section reveal"><div className="container"><div className="easy-section-heading"><span className="eyebrow">WHAT WE DO</span><h2>Listening, learning and sharing practical wellness knowledge.</h2></div><div className="outreach-grid">{activities.map((activity) => <article className="outreach-card content-card" key={activity.title}><img src={activity.image} alt={activity.alt} /><div><h2>{activity.title}</h2><p>{activity.text}</p></div></article>)}</div></div></section><section className="outreach-commitment reveal"><div className="container outreach-commitment-grid"><HeartHandshake size={48} /><div><span className="eyebrow">PARTNERS WELCOME</span><h2>Bring your people, purpose, and ideas.</h2><p>Schools, churches, NGOs, companies, wellness practitioners, and community associations can contact us to discuss a learning event, sponsorship, product showcase, or partnership.</p><Link className="easy-text-link" to="/contact">Discuss a partnership <ArrowRight size={17} /></Link></div><Users size={48} /></div></section></main><Footer /></>;
}
