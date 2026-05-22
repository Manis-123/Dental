import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <span className="logo">🦷</span>
            <div>
              <h1>DentalCare</h1>
              <p>Professional Dental Clinic</p>
            </div>
          </div>
          <div className="navbar-links">
            <a href="#services">Services</a>
            <a href="#doctors">Doctors</a>
            <a href="#why-us">Why Us</a>
            <a href="#contact">Contact</a>
            {isAuthenticated ? (
              <Link to="/" className="btn btn-primary">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Your Smile, Our Priority</h2>
          <p>Experience world-class dental care with our expert team of dentists and modern facilities</p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link to="/" className="btn btn-primary btn-lg">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-lg">
                  Book Appointment
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Register Now
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-card">
            <span>😁</span>
            <h3>Healthy Smiles</h3>
          </div>
          <div className="hero-card">
            <span>⭐</span>
            <h3>Expert Team</h3>
          </div>
          <div className="hero-card">
            <span>✨</span>
            <h3>Modern Tech</h3>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="section-header">
          <h2>Our Services</h2>
          <p>Comprehensive dental care for your whole family</p>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <span className="service-icon">🦷</span>
            <h3>General Dentistry</h3>
            <p>Regular checkups, cleanings, and preventive care to keep your teeth healthy</p>
          </div>
          <div className="service-card">
            <span className="service-icon">✨</span>
            <h3>Teeth Whitening</h3>
            <p>Professional whitening treatments for a brighter, more confident smile</p>
          </div>
          <div className="service-card">
            <span className="service-icon">🛡️</span>
            <h3>Root Canal Treatment</h3>
            <p>Advanced endodontic treatments to save and restore your natural teeth</p>
          </div>
          <div className="service-card">
            <span className="service-icon">👑</span>
            <h3>Dental Implants</h3>
            <p>Permanent solution for missing teeth with natural-looking implants</p>
          </div>
          <div className="service-card">
            <span className="service-icon">🧒</span>
            <h3>Pediatric Dentistry</h3>
            <p>Specialized care for children in a friendly and comfortable environment</p>
          </div>
          <div className="service-card">
            <span className="service-icon">🔧</span>
            <h3>Orthodontics</h3>
            <p>Braces and aligners to straighten your teeth and improve your bite</p>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="doctors">
        <div className="section-header">
          <h2>Meet Our Doctors</h2>
          <p>Expert dental professionals dedicated to your care</p>
        </div>
        <div className="doctors-grid">
          <div className="doctor-card">
            <div className="doctor-avatar">👨‍⚕️</div>
            <h3>Dr. Rajesh Sharma</h3>
            <p className="doctor-title">Chief Dentist & Founder</p>
            <p className="doctor-bio">20+ years of experience in comprehensive dental care, root canal treatment, and cosmetic dentistry. BDS degree from Delhi University with advanced training in implantology.</p>
            <div className="doctor-rating">⭐⭐⭐⭐⭐ (4.9/5)</div>
          </div>
          <div className="doctor-card">
            <div className="doctor-avatar">👩‍⚕️</div>
            <h3>Dr. Priya Singh</h3>
            <p className="doctor-title">Orthodontist</p>
            <p className="doctor-bio">Specialist in braces, aligners, and smile correction. 12 years of experience in creating beautiful smiles. MSc from Mumbai Dental College.</p>
            <div className="doctor-rating">⭐⭐⭐⭐⭐ (4.8/5)</div>
          </div>
          <div className="doctor-card">
            <div className="doctor-avatar">👨‍⚕️</div>
            <h3>Dr. Arjun Verma</h3>
            <p className="doctor-title">Dental Surgeon</p>
            <p className="doctor-bio">Expert in complex dental procedures, oral surgery, and dental implants. 15 years of specialized surgical experience.</p>
            <div className="doctor-rating">⭐⭐⭐⭐⭐ (4.7/5)</div>
          </div>
          <div className="doctor-card">
            <div className="doctor-avatar">👩‍⚕️</div>
            <h3>Dr. Neha Patel</h3>
            <p className="doctor-title">Pediatric Dentist</p>
            <p className="doctor-bio">Passionate about creating positive dental experiences for children. Specialized in child psychology and preventive dental care. 10 years with kids.</p>
            <div className="doctor-rating">⭐⭐⭐⭐⭐ (4.9/5)</div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="why-us">
        <div className="section-header">
          <h2>Why Choose DentalCare?</h2>
          <p>What makes us different</p>
        </div>
        <div className="why-us-grid">
          <div className="why-us-item">
            <div className="why-us-icon">🏥</div>
            <h3>Modern Facility</h3>
            <p>State-of-the-art equipment and technology for best results</p>
          </div>
          <div className="why-us-item">
            <div className="why-us-icon">👥</div>
            <h3>Expert Team</h3>
            <p>Board-certified dentists with years of experience</p>
          </div>
          <div className="why-us-item">
            <div className="why-us-icon">🕐</div>
            <h3>Flexible Hours</h3>
            <p>Open 7 days a week with online appointment booking</p>
          </div>
          <div className="why-us-item">
            <div className="why-us-icon">💰</div>
            <h3>Affordable Pricing</h3>
            <p>Transparent pricing with flexible payment options</p>
          </div>
          <div className="why-us-item">
            <div className="why-us-icon">😊</div>
            <h3>Patient Care</h3>
            <p>Comfortable environment and friendly staff</p>
          </div>
          <div className="why-us-item">
            <div className="why-us-icon">🔒</div>
            <h3>Privacy & Safety</h3>
            <p>HIPAA compliant and strict hygiene protocols</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <h2>15K+</h2>
            <p>Happy Patients</p>
          </div>
          <div className="stat-item">
            <h2>4</h2>
            <p>Expert Dentists</p>
          </div>
          <div className="stat-item">
            <h2>50+</h2>
            <p>Services Offered</p>
          </div>
          <div className="stat-item">
            <h2>4.8★</h2>
            <p>Average Rating</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-header">
          <h2>Patient Testimonials</h2>
          <p>What our patients say about us</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Dr. Rajesh Sharma is exceptional! His expertise and compassionate approach made my dental treatment incredibly comfortable. Highly recommend!"
            </p>
            <p className="testimonial-author">- Priya Verma</p>
          </div>
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Dr. Priya Singh's orthodontic care transformed my smile! She's patient, professional, and explains everything clearly. Best decision ever!"
            </p>
            <p className="testimonial-author">- Vikram Patel</p>
          </div>
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "My kids love visiting Dr. Neha Patel! She makes dental visits fun and painless. The whole family gets treatment here now."
            </p>
            <p className="testimonial-author">- Anjali Gupta</p>
          </div>
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Dr. Arjun Verma's surgical expertise saved my teeth! Professional, skilled, and caring. Best dental clinic in the city!"
            </p>
            <p className="testimonial-author">- Rahul Desai</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="section-header">
          <h2>Get In Touch</h2>
          <p>We'd love to hear from you</p>
        </div>
        <div className="contact-grid">
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <h3>Location</h3>
            <p>123 Dental Street, Medical Center</p>
            <p>Karachi, Pakistan</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <h3>Phone</h3>
            <p>+92 (21) 3456-7890</p>
            <p>Mon-Sat: 9AM-9PM, Sun: 10AM-8PM</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <h3>Email</h3>
            <p>info@dentalcare.com</p>
            <p>support@dentalcare.com</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>DentalCare</h3>
            <p>Your smile is our mission</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#doctors">Doctors</a>
              </li>
              <li>
                <a href="#why-us">Why Us</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#facebook">Facebook</a>
              <a href="#instagram">Instagram</a>
              <a href="#twitter">Twitter</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 DentalCare. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </footer>
    </div>
  );
}
