import "./App.css";

function App() {
  const skills = [
    "HTML5 & CSS3",
    "JavaScript (ES6+)",
    "React.js",
    "Node.js",
    "Express.js",
    "Python",
    "Java",
    "SQL",
    "Git & GitHub",
    "REST APIs",
    "MongoDB",
    "AI & Data Science",
  ];

  return (
    <div className="page">

      {/* Header */}
      <header className="hero">
        <div className="hero-content">
          <div className="profile-icon">
            SU
          </div>

          <h1>Shalini Udayakumar</h1>

          <p>Full Stack Developer</p>

          <div className="hero-line"></div>

          <span>
            Building modern, scalable and user-focused digital experiences
          </span>
        </div>
      </header>

      <main className="container">

        {/* Profile */}
        <section className="card profile-card">
          <div className="card-heading">
            <span className="heading-icon">👤</span>
            <h2>Profile</h2>
          </div>

          <div className="profile-details">

            <div className="detail">
              <strong>Name:</strong>
              <span>Shalini Udayakumar</span>
            </div>

            <div className="detail">
              <strong>Age:</strong>
              <span>22</span>
            </div>

            <div className="detail">
              <strong>Education:</strong>
              <span>B.Tech – Artificial Intelligence & Data Science</span>
            </div>

            <div className="detail">
              <strong>College:</strong>
              <span>
                Prince Dr. K. Vasudevan College of Engineering and Technology
              </span>
            </div>

            <div className="detail">
              <strong>Location:</strong>
              <span>Chennai & Hyderabad, India</span>
            </div>

          </div>
        </section>


        {/* About Me */}
        <section className="card about-card">
          <div className="card-heading">
            <span className="heading-icon">✨</span>
            <h2>About Me</h2>
          </div>

          <p>
            I am a passionate Full Stack Developer with a strong interest in
            building modern, responsive and user-friendly web applications.
            With a background in Artificial Intelligence and Data Science, I
            enjoy combining software development with intelligent technologies
            to create meaningful digital solutions.
          </p>

          <p>
            I continuously explore new technologies, improve my problem-solving
            abilities and work on practical projects that strengthen both my
            technical and creative skills. I am always eager to learn,
            collaborate and transform ideas into impactful applications.
          </p>
        </section>


        {/* Technical Skills */}
        <section className="card skills-card">
          <div className="card-heading">
            <span className="heading-icon">💻</span>
            <h2>Technical Skills</h2>
          </div>

          <div className="skills-container">
            {skills.map((skill, index) => (
              <span className="skill" key={index}>
                {skill}
              </span>
            ))}
          </div>
        </section>


        {/* Career Objective */}
        <section className="card objective-card">
          <div className="card-heading">
            <span className="heading-icon">🎯</span>
            <h2>Career Objective</h2>
          </div>

          <p>
            To become a skilled and innovative Full Stack Developer who can
            design, develop and maintain scalable web applications while
            continuously learning emerging technologies. I aim to contribute
            my knowledge of software development, Artificial Intelligence and
            Data Science to build efficient solutions and grow as a successful
            technology professional.
          </p>
        </section>


        {/* Projects */}
        <section className="card projects-card">
          <div className="card-heading">
            <span className="heading-icon">🚀</span>
            <h2>What I Love Building</h2>
          </div>

          <div className="project-grid">

            <div className="mini-project">
              <div className="project-icon">🌐</div>
              <h3>Web Applications</h3>
              <p>
                Responsive and modern web applications using React,
                JavaScript and modern frontend technologies.
              </p>
            </div>

            <div className="mini-project">
              <div className="project-icon">⚙️</div>
              <h3>Full Stack Systems</h3>
              <p>
                Complete applications connecting intuitive interfaces with
                powerful backend services and databases.
              </p>
            </div>

            <div className="mini-project">
              <div className="project-icon">🤖</div>
              <h3>AI Solutions</h3>
              <p>
                Exploring Artificial Intelligence and Data Science to create
                smarter and more useful technology solutions.
              </p>
            </div>

          </div>
        </section>


        {/* Contact */}
        <section className="card contact-card">
          <div className="card-heading">
            <span className="heading-icon">📞</span>
            <h2>Contact Details</h2>
          </div>

          <div className="contact-list">

            <a href="mailto:shalini.udayakumar@example.com">
              <span>📧</span>
              <div>
                <strong>Email</strong>
                <p>shalini.udayakumar@example.com</p>
              </div>
            </a>

            <a href="tel:+919876543210">
              <span>📱</span>
              <div>
                <strong>Phone</strong>
                <p>+91 98765 43210</p>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
            >
              <span>💼</span>
              <div>
                <strong>LinkedIn</strong>
                <p>linkedin.com/in/shalini-udayakumar</p>
              </div>
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              <span>💻</span>
              <div>
                <strong>GitHub</strong>
                <p>github.com/shalini-udayakumar</p>
              </div>
            </a>

          </div>
        </section>


        {/* Quote */}
        <section className="quote">
          <div className="quote-mark">“</div>

          <p>
            Turning ideas into meaningful digital experiences,
            one line of code at a time.
          </p>

          <span>— Shalini Udayakumar</span>
        </section>

      </main>


      {/* Footer */}
      <footer>
        <div className="footer-line"></div>

        <p>
          © 2026 <strong>Shalini Udayakumar</strong>
        </p>

        <span>
          Full Stack Developer • AI & Data Science
        </span>

        <p className="footer-message">
          Built with ❤️ using React.js
        </p>
      </footer>

    </div>
  );
}

export default App;