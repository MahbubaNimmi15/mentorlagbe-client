
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const subjects = [
  { name: "Mathematics", icon: "∑", count: "Build confidence" },
  { name: "Physics", icon: "⚛", count: "Learn concepts" },
  { name: "Programming", icon: "</>", count: "Code smarter" },
  { name: "English & IELTS", icon: "Aa", count: "Improve skills" },
];

const steps = [
  {
    number: "01",
    title: "Discover a mentor",
    description:
      "Explore subjects, class levels, learning modes, and budgets.",
  },
  {
    number: "02",
    title: "Apply for tuition",
    description:
      "Choose your preferred schedule and send your application.",
  },
  {
    number: "03",
    title: "Start learning",
    description:
      "Connect with your tutor after your application is accepted.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site">
      <header className="site-header">
        <nav className="navbar container">
          <Link href="/" className="brand">
            <span className="brand-icon">
              <GraduationCap size={25} />
            </span>
            <span>MentorLagbe</span>
          </Link>

          <div className="desktop-navigation">
            <Link href="/">Home</Link>
            <Link href="/tuitions">Browse Tuitions</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/#how-it-works">How It Works</Link>
          </div>

          <div className="desktop-actions">
            <Link href="/sign-in" className="login-link">
              Sign In
            </Link>
            <Link href="/sign-up" className="btn btn-primary">
              Get Started <ArrowRight size={17} />
            </Link>
          </div>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        {menuOpen && (
          <div className="mobile-navigation">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link
              href="/tuitions"
              onClick={() => setMenuOpen(false)}
            >
              Browse Tuitions
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="eyebrow">
                <Sparkles size={16} />
                A smarter way to learn
              </div>

              <h1>
                Find the right mentor.
                <span> Unlock your potential.</span>
              </h1>

              <p className="hero-description">
                Discover personalized tuition and mentorship
                opportunities that match your subjects, goals,
                schedule, and budget.
              </p>

              <div className="hero-actions">
                <Link
                  href="/tuitions"
                  className="btn btn-primary btn-large"
                >
                  <Search size={19} />
                  Explore Tuitions
                </Link>

                <Link
                  href="/sign-up"
                  className="btn btn-outline btn-large"
                >
                  Become a Tutor
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="hero-benefits">
                <span>
                  <CheckCircle2 size={17} /> Flexible learning
                </span>
                <span>
                  <CheckCircle2 size={17} /> Online & offline
                </span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-glow" />

              <div className="learning-card">
                <div className="learning-card-top">
                  <span className="live-indicator" />
                  YOUR LEARNING JOURNEY
                </div>

                <div className="learning-icon">
                  <GraduationCap size={52} />
                </div>

                <h2>Learn with purpose.</h2>
                <p>
                  Find guidance for every milestone of your
                  academic journey.
                </p>

                <div className="mini-features">
                  <div>
                    <BookOpen size={22} />
                    <span>Subject-focused</span>
                  </div>
                  <div>
                    <Users size={22} />
                    <span>1-on-1 & batches</span>
                  </div>
                  <div>
                    <ShieldCheck size={22} />
                    <span>Reviewed listings</span>
                  </div>
                </div>
              </div>

              <div className="floating-tag">
                <Sparkles size={17} />
                Your goals. Your mentor.
              </div>
            </div>
          </div>
        </section>

        <section className="subjects-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-kicker">
                  EXPLORE SUBJECTS
                </span>
                <h2>What would you like to learn?</h2>
                <p>
                  Explore learning opportunities across popular
                  academic subjects.
                </p>
              </div>

              <Link href="/tuitions" className="text-link">
                Browse All
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="subject-grid">
              {subjects.map((subject) => (
                <Link
                  href="/tuitions"
                  className="subject-card"
                  key={subject.name}
                >
                  <div className="subject-icon">
                    {subject.icon}
                  </div>
                  <h3>{subject.name}</h3>
                  <p>{subject.count}</p>
                  <ArrowRight
                    size={20}
                    className="subject-arrow"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          className="how-section"
          id="how-it-works"
        >
          <div className="container">
            <div className="center-heading">
              <span className="section-kicker">
                SIMPLE & EFFECTIVE
              </span>
              <h2>How MentorLagbe Works</h2>
              <p>
                Three simple steps to start your next learning
                experience.
              </p>
            </div>

            <div className="steps-grid">
              {steps.map((step) => (
                <div className="step-card" key={step.number}>
                  <div className="step-number">
                    {step.number}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-panel">
              <div>
                <span className="cta-label">
                  START YOUR JOURNEY
                </span>
                <h2>Your next milestone starts here.</h2>
                <p>
                  Join MentorLagbe and take the next step
                  toward your learning goals.
                </p>
              </div>
              <Link
                href="/sign-up"
                className="btn btn-light"
              >
                Create Your Account
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <Link href="/" className="brand footer-brand">
              <span className="brand-icon">
                <GraduationCap size={23} />
              </span>
              <span>MentorLagbe</span>
            </Link>
            <p>
              Connecting learners with meaningful mentorship
              opportunities.
            </p>
          </div>

          <div className="footer-links">
            <h4>Explore</h4>
            <Link href="/">Home</Link>
            <Link href="/tuitions">Browse Tuitions</Link>
            <Link href="/pricing">Pricing</Link>
          </div>

          <div className="footer-links">
            <h4>Account</h4>
            <Link href="/sign-in">Sign In</Link>
            <Link href="/sign-up">Sign Up</Link>
          </div>

          <div className="footer-links">
            <h4>Follow Us</h4>
            <span>Social links coming soon</span>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} MentorLagbe.
            All rights reserved.
          </span>
          <span>Made for lifelong learners.</span>
        </div>
      </footer>
    </div>
  );
}
