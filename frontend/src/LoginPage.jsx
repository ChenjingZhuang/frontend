import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For redirecting after successful login

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous error message

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // On successful login, alert and redirect to home or dashboard
        alert('Login successful');
        navigate('/'); // Redirect to home page or dashboard
      } else {
        // If error occurred during login
        setError(data.error || 'An unexpected error occurred');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to connect to the server');
    }
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {/* Display error message if there's an error */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default LoginPage;
