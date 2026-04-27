import emailjs from '@emailjs/browser';
import { Linkedin, Mail, Phone, Send } from 'lucide-react';
import { useRef, useState } from 'react';
import { profile } from '../data/portfolio';

const emailJsConfigured =
  import.meta.env.VITE_EMAILJS_SERVICE_ID && import.meta.env.VITE_EMAILJS_TEMPLATE_ID && import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState('');

  const sendEmail = async (event) => {
    event.preventDefault();

    if (!emailJsConfigured) {
      setStatus('EmailJS keys are not configured yet. This form is ready once the .env values are added.');
      return;
    }

    setStatus('Sending...');
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      formRef.current.reset();
      setStatus('Message sent successfully.');
    } catch {
      setStatus('Message could not be sent. Please email directly.');
    }
  };

  return (
    <section id="contact" className="section pb-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[0.85fr_1fr] md:px-8">
        <div className="reveal">
          <p className="eyebrow">Contact</p>
          <h2 className="section-title">Let’s build something reliable, useful, and sharp.</h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
            Feel free to reach out for collaboration, opportunities, or discussions around full-stack development and AI-driven
            solutions.
          </p>
          <div className="mt-8 grid gap-3 text-white/68">
            <a className="contact-link" href={`mailto:${profile.email}`}>
              <Mail size={18} />
              {profile.email}
            </a>
            <a className="contact-link" href={`tel:${profile.phone}`}>
              <Phone size={18} />
              {profile.phone}
            </a>
            <a className="contact-link" href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={18} />
              LinkedIn Profile
            </a>
          </div>
        </div>

        <form ref={formRef} onSubmit={sendEmail} className="reveal contact-form">
          <label>
            <span>Name</span>
            <input name="from_name" type="text" placeholder="Your name" required />
          </label>
          <label>
            <span>Email</span>
            <input name="reply_to" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows="5" placeholder="Tell me what you want to build" required />
          </label>
          <button type="submit" className="primary-button w-full justify-center">
            Send Message
            <Send size={18} />
          </button>
          {status && <p className="text-sm text-white/58">{status}</p>}
        </form>
      </div>
    </section>
  );
}
