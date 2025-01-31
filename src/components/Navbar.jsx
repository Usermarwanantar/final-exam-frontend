import React from 'react';
import { logout } from '../components/utils/auth'; 
import { useUser } from '../components/UserProvider/UserProvider';
import { useNavigate } from 'react-router-dom';
import './navbar.css'; 

const Navbar = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setUser(null); 
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
        </nav>
    );
};

export default Navbar;