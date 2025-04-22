import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './LoginPage'; // Assuming LoginPage is created
import RegisterPage from './RegisterPage'; // Assuming RegisterPage is created

function App() {
  const [activeTab, setActiveTab] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="icon left" />
          <h1>Interesting facts about Dog’s Language</h1>
          <div className="icon right" />
        </header>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <Link to="/login">
            <button className="auth-button">Login</button>
          </Link>
          <Link to="/register">
            <button className="auth-button">Register</button>
          </Link>
        </div>

        {/* Routes for the Login and Register pages */}
        <Routes>
          <Route
            path="/login"
            element={
              <div className="auth-page">
                <div className="auth-form">
                  <h2>Login</h2>
                  <form>
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button type="submit">Login</button>
                  </form>
                </div>
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="auth-page">
                <div className="auth-form">
                  <h2>Register</h2>
                  <form>
                    <input type="text" placeholder="Username" />
                    <input type="password" placeholder="Password" />
                    <button type="submit">Register</button>
                  </form>
                </div>
              </div>
            }
          />
        </Routes>

        {/* Main Content for the Home Page */}
        <div className="search-bar">
          <div className="home-icon" />
          <input type="text" placeholder="Search" />
        </div>

        <nav className="nav-tabs">
          <div
            className={`tab ${activeTab === 'bodyLanguage' ? 'active' : ''}`}
            onClick={() => handleTabClick('bodyLanguage')}
          >
            Body language
          </div>
          <div
            className={`tab ${activeTab === 'differentSounds' ? 'active' : ''}`}
            onClick={() => handleTabClick('differentSounds')}
          >
            Different Sounds
          </div>
        </nav>

        <main className="main-content">
          <div className="side-buttons left">
            <button>Decode Your Dog's Language</button>
            <button>Bark, Wag, or Whine? Know What It Means</button>
          </div>

          <div className="dog-image">
            <img src="/dog-image.jpg" alt="Happy dog communicating" />
          </div>

          <div className="side-buttons right">
            <button>Strengthen Your Bond: Speak ‘Dog’ Fluently</button>
            <button>From Puppy Eyes to Happy Howls: The Ultimate Dog Communication Guide</button>
          </div>
        </main>

        <div className="caption">
          <strong>Stop Misunderstanding Your Dog!</strong><br />
          🚫 Many behavioral issues stem from miscommunication. Learn to respond correctly to your dog’s signals and prevent common mistakes.
        </div>

        <footer className="footer">
          <div className="icon bottom" />
          <p>Care about your Dog</p>
          <div className="icon up-arrow" />
        </footer>
      </div>
    </Router>
  );
}

export default App;
