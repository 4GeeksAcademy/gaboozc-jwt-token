import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Using your specific VITE_BACKEND_URL (from .env)
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Registration failed. Please try again.");
      }

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Sign Up</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="8"
            placeholder="At least 8 characters"
          />
          <div className="form-text">
            Password must contain at least one number and uppercase letter
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-3 text-center">
        Already have an account?{" "}
        <a href="/login" className="text-decoration-none">
          Login here
        </a>
      </div>
    </div>
  );
};
