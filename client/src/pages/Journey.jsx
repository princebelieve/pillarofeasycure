import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useScrollReveal from "../hooks/useScrollReveal";
import useAuth from "../context/AuthContext";
import { ArrowRight, HeartPulse, Sprout, Users } from "lucide-react";

const milestones = [
  { year: "01", title: "Learn and ask questions", text: "Begin with practical wellness education and a conversation about the choices that matter to you.", icon: Sprout },
  { year: "02", title: "Choose with care", text: "Explore product information and directions, and seek qualified medical advice for health concerns.", icon: Users },
  { year: "03", title: "Carry knowledge forward", text: "Share useful learning and encourage healthier choices in your family and community.", icon: HeartPulse },
];

export default function Journey() {
  const { isLoggedIn } = useAuth();
  useScrollReveal();
  return <><Navbar /><main className="journey-page"><section className="journey-hero reveal"><div className="container journey-hero-grid"><div><span className="eyebrow">THE EASYCURE JOURNEY</span><h1>Learn, choose, and grow with care.</h1><p>Professor Clara’s approach begins with knowledge, responsible wellness choices and compassionate support. Your journey can start with learning more and asking questions about your needs.</p><Link className="easy-btn easy-btn-primary breathing-button" to={isLoggedIn ? "/dashboard" : "/register"}>{isLoggedIn ? "Go to your dashboard" : "Start your journey"} <ArrowRight size={18} /></Link></div><img className="breathing-image" src="/images/founder-community-wellness-session.jpg" alt="Professor Clara sharing wellness information at a community event" /></div></section><section className="section reveal"><div className="container"><div className="easy-section-heading"><span className="eyebrow">YOUR NEXT CHAPTER</span><h2>Progress is built one meaningful step at a time.</h2></div><div className="journey-milestones">{milestones.map(({ year, title, text, icon: Icon }) => <article className="journey-card content-card" key={year}><span className="journey-number">{year}</span><Icon size={30} /><h2>{title}</h2><p>{text}</p></article>)}</div></div></section><section className="journey-stories reveal"><div className="container journey-stories-grid"><div><span className="eyebrow">WELLNESS IN PRACTICE</span><h2>Care starts with listening.</h2><p>Professor Clara’s supplied photos show her sharing wellness information and speaking with individuals and community members. Explore more moments from these outreach activities.</p><Link className="easy-btn easy-btn-primary breathing-button" to="/outreach">Explore community outreach <ArrowRight size={18} /></Link></div><img className="breathing-image" src="/images/founder-wellness-consultation.jpg" alt="Professor Clara discussing wellness information with a visitor" /></div></section></main><Footer /></>;
}
