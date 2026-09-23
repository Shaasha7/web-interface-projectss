import "./App.css";

function App() {
  const hobbies = [
    {
      id: 1,
      title: "Reading",
      category: "LEARNING",
      icon: "📚",
      description:
        "Exploring new ideas through books helps me learn, grow, and discover different perspectives.",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: 2,
      title: "Listening to Music",
      category: "LIFESTYLE",
      icon: "🎧",
      description:
        "Music helps me relax, stay inspired, and create the perfect mood throughout my day.",
      image:
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: 3,
      title: "Photography",
      category: "CREATIVE",
      icon: "📷",
      description:
        "Capturing beautiful moments allows me to express creativity and preserve memories.",
      image:
        "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: 4,
      title: "Cooking",
      category: "CREATIVE",
      icon: "🍳",
      description:
        "Experimenting with recipes lets me combine creativity, flavors, and a little bit of fun.",
      image:
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: 5,
      title: "Traveling",
      category: "ADVENTURE",
      icon: "✈️",
      description:
        "Discovering new places, cultures, and experiences is one of my favorite ways to grow.",
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85",
    },
    {
      id: 6,
      title: "Playing Sports",
      category: "FITNESS",
      icon: "🏀",
      description:
        "Sports keep me active, energetic, and motivated while teaching me teamwork and discipline.",
      image:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  return (
    <div className="page">

      {/* Background decoration */}
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <main className="container">

        {/* Header */}
        <header className="hero">

          <div className="small-heading">
            <span className="line"></span>
            <span>ABOUT ME</span>
            <span className="line"></span>
          </div>

          <h1>
            My <span>Hobbies</span>
          </h1>

          <p>
            A few things I enjoy doing in my free time
          </p>

        </header>

        {/* Hobby Grid */}
        <section className="hobby-grid">

          {hobbies.map((hobby) => (
            <article className="hobby-card" key={hobby.id}>

              {/* Image */}
              <div className="image-container">

                <img
                  src={hobby.image}
                  alt={hobby.title}
                />

                <div className="image-overlay"></div>

                <div className="category">
                  {hobby.category}
                </div>

                <div className="hobby-icon">
                  {hobby.icon}
                </div>

              </div>

              {/* Content */}
              <div className="card-content">

                <h2>{hobby.title}</h2>

                <p>{hobby.description}</p>

                <div className="card-footer">
                  <span>Explore my interest</span>

                  <span className="arrow">
                    →
                  </span>
                </div>

              </div>

            </article>
          ))}

        </section>

        {/* Bottom quote */}
        <section className="quote">

          <div className="quote-mark">“</div>

          <p>
            Life is about finding the things that make you feel alive.
          </p>

          <span>— My Personal Philosophy</span>

        </section>

        {/* Footer */}
        <footer>
          <span>MY HOBBIES</span>
          <span className="dot">•</span>
          <span>A LITTLE ABOUT ME</span>
        </footer>

      </main>
    </div>
  );
}

export default App;