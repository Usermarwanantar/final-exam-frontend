import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserProvider/UserProvider";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  // Login.jsx
const handleFormSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:8080/login`;
  
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
  
      const result = await axios.post(url, formData, { withCredentials: true });
      const data = result.data;
  
      if (data.role) {
        document.cookie = `JSESSIONID=${data.jsessionId}; path=/`; 
        
        // Get user details after successful login
        const userDetailsResponse = await axios.get(`http://localhost:8080/auth/user-details`, {
          withCredentials: true
        });
        
        // Store complete user data including ID
        setUser({
          id: userDetailsResponse.data.id,
          username: userDetailsResponse.data.username,
          role: data.role,
          fullName: userDetailsResponse.data.fullName
        });
        
        navigate(data.role === "ROLE_CLIENT" ? "/dashboard" : "/admin-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    }
  };
  
  return (
    <>
    <h2 className="log">Login</h2>
    <form className="form" onSubmit={handleFormSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
    </>
  );
};

export default Login;
