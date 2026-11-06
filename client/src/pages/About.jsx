import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useScrollReveal from "../hooks/useScrollReveal";

const values = [
  ["Nature", "We draw inspiration from nature and encourage responsible use of natural products and resources."],
  ["Compassion", "We meet each person with kindness, dignity and respect, recognising that every wellness journey is unique."],
  ["Integrity", "We aim for honesty, transparency and ethical conduct in our products, services and relationships."],
  ["Excellence", "We keep learning and work to provide thoughtful, quality service."],
  ["Holistic Wellness", "We recognise how physical, mental, emotional, social and lifestyle factors shape well-being."],
  ["Innovation and Knowledge", "We value research, scientific knowledge, responsible traditional wisdom and fresh approaches to wellness education."],
  ["Sustainability", "We support responsible environmental practices and care for natural resources for future generations."],
];

export default function About() {
  useScrollReveal();
  return <><Navbar /><main>
    <section className="about-hero reveal"><div className="container about-hero-grid"><div className="about-copy"><span className="eyebrow">ABOUT PILLAR OF EASYCURE AND WELLNESS HAVEN</span><h1>A haven for<br />healthier living.</h1><p>Founded by Professor Clara Obehi Egonmwan, Pillar of Easycare and Wellness Haven brings nature, knowledge and compassionate care together to encourage healthier living.</p><Link className="easy-text-link" to="/our-director">Read the founder’s message <ArrowRight size={17} /></Link></div><div className="about-image-wrap hover-lift easy-about-mark"><img src="/images/founder-clara-egonmwan.jpg" alt="Professor Clara Obehi Egonmwan, founder of Pillar of Easycare and Wellness Haven" /></div></div></section>
    <section className="section reveal"><div className="container about-story"><div className="story-card hover-lift"><h2 className="title">Our Vision</h2><p className="muted">To become a leading and trusted natural wellness destination that inspires healthier communities through nature, responsible complementary wellness practices, education and compassionate care.</p><p className="muted">We envision people equipped with the knowledge, resources and support to make informed health choices and live more fulfilling lives.</p></div><div className="story-card hover-lift"><h2 className="title">Our Mission</h2><ul className="promise-list"><li><strong>Natural wellness:</strong> Encourage responsible nature-based approaches and quality organic products.</li><li><strong>Education:</strong> Share practical knowledge about healthy lifestyles, nutrition, natural resources and prevention.</li><li><strong>Personalised care:</strong> Offer compassionate support that recognises each person’s needs.</li><li><strong>Complementary practices:</strong> Promote responsible approaches that may complement conventional medical care.</li><li><strong>Community impact:</strong> Make wellness knowledge more accessible and build sustainable relationships with people and nature.</li><li><strong>Quality and integrity:</strong> Uphold product quality, transparency and responsible practice.</li></ul></div></div></section>
    <section className="section-alt reveal"><div className="container"><div className="values-header"><span className="eyebrow">OUR CORE VALUES</span><h2 className="title">Guided by care, knowledge and responsibility.</h2></div><div className="service-grid">{values.map(([name, description]) => <div className="service-card hover-lift" key={name}><h3>{name}</h3><p>{description}</p></div>)}</div></div></section>
    <section className="section reveal"><div className="container story-card"><span className="eyebrow">OUR BRAND PROMISE</span><h2 className="title">We care. We educate. We inspire. We promote wellness.</h2><p className="muted">We aim to make each wellness journey meaningful through compassionate care, responsible natural wellness support, quality products and continuous education. We promote informed choices and a culture of healthy living.</p></div></section>
  </main><Footer /></>;
}
