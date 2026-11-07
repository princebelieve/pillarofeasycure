import { useState } from "react";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { submitInquiry } from "../services/api";
import useScrollReveal from "../hooks/useScrollReveal";

export default function Contact() {
  useScrollReveal();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", projectType: "", message: "" });
  const [message, setMessage] = useState("");
  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  async function submit(event) {
    event.preventDefault();
    try {
      await submitInquiry(form);
      setMessage("Thank you. EASYCURE will get in touch shortly.");
      setForm({ fullName: "", email: "", phone: "", projectType: "", message: "" });
    } catch (error) {
      setMessage(error.message || "Your enquiry could not be sent.");
    }
  }

  return <><Navbar /><main className="contact-page"><section className="contact-hero reveal"><div className="container contact-hero-card"><div className="contact-copy"><span className="eyebrow">CONTACT PILLAR OF EASYCURE AND WELLNESS HAVEN</span><h1>Let’s take the next step together.</h1><p>Ask about wellness products, orders, delivery, distributor applications, or partnership opportunities.</p><div className="contact-strip"><a href="https://wa.me/2348029778813" target="_blank" rel="noreferrer" className="strip-card whatsapp-card"><MessageCircle size={28} /><div><strong>Chat on WhatsApp</strong><span>+2348029778813</span></div></a><div className="strip-card email-card"><Phone size={28} /><div><strong>Call EASYCURE</strong><a className="contact-number" href="tel:+2348117240100">+2348117240100</a><a className="contact-number" href="tel:+2348131339028">+2348131339028</a></div></div></div></div></div></section><section className="section reveal"><div className="container about-story"><div className="story-card reveal"><h2 className="title">Send an enquiry</h2><form className="form" onSubmit={submit}><input required name="fullName" placeholder="Full name" value={form.fullName} onChange={change} /><input required type="email" name="email" placeholder="Email address" value={form.email} onChange={change} /><input required name="phone" placeholder="Phone / WhatsApp number" value={form.phone} onChange={change} /><select required name="projectType" value={form.projectType} onChange={change}><option value="">What can we help with?</option><option>Wellness products</option><option>Orders and delivery</option><option>Distributor applications</option><option>Community outreach</option><option>Partnership opportunity</option><option>General enquiry</option></select><textarea required name="message" rows="5" placeholder="Tell us how we can help." value={form.message} onChange={change} /><button className="primary">Send enquiry</button>{message && <p>{message}</p>}</form></div><div className="story-card reveal"><MapPin size={30} /><h2 className="title">Visit EASYCURE</h2><p className="contact-address"><strong>Registered business address</strong><br />13, Uwumarongie Street, GRA, Benin City<br />Edo State, Nigeria</p><p className="contact-address">Everyone is welcome. Contact us before visiting for a product or business enquiry.</p></div></div></section></main><Footer /></>;
}
