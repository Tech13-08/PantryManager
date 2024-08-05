import React from "react";
import Header from "./Header";
import Footer from "./Footer";

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <section className="hero">
          <h1>Welcome</h1>
          <p>The right way to pantry manage.</p>
        </section>
        <section className="features">
          <div className="feature">
            <h2>Pantry Log</h2>
            <p>Animated gif of data table here</p>
          </div>
          <div className="feature">
            <h2>Expiration Tracking</h2>
            <p>Animated gif of expiration date tracking here</p>
          </div>
          <div className="feature">
            <h2>AI Item Identifier</h2>
            <p>Animated gif of AI Item Identifier here</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
