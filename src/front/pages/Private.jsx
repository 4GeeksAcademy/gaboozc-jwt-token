import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${backendUrl}/api/private`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json().then((data) => ({ status: res.status, body: data })))
      .then(({ status, body }) => {
        if (status === 200) {
          setUserData(body);
        } else {
          setError(body.msg || "Unauthorized");
          sessionStorage.removeItem("token");
          navigate("/login");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>Private Page</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {userData && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Welcome!</h5>
            <p className="card-text">{userData.msg}</p>
            <p>Email: {userData.user.email}</p>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
