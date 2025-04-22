import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset the message
    setMessage('');

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('❌ Invalid email format');
      return;
    }

    // Basic password validation (password must be at least 6 characters)
    if (password.length < 6) {
      setMessage('❌ Password must be at least 6 characters');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/register', {
        method: 'POST', // Ensure this is POST method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Sending email and password to backend
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Registered successfully!');
        setTimeout(() => navigate('/login'), 1500); // Redirect to login after successful registration
      } else {
        setMessage(`❌ ${data.error || 'Registration failed'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Network or server error');
    }
  };

  return (
    <div className="auth-page">
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
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
        <button type="submit">Register</button>
      </form>
      {message && <p className="auth-message">{message}</p>} {/* Display feedback message */}
    </div>
  );
}

export default RegisterPage;
