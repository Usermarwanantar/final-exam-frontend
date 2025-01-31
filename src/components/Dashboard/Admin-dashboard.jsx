import { Link,useNavigate } from 'react-router-dom';
import './style.css'; 
import { useUser } from "../UserProvider/UserProvider";
import React, { useEffect, useState } from 'react';
import { logout } from '../utils/auth';
import Navbar from '../Navbar';




const AdminDashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar /> {/* Add the Navbar here */}
            <div className="dashboard">
                <Link to="/flights">
                    <div id='flights' style={{ width: "200px", rowGap: "0px", margin: 5 }} className="dashboard-item">
                        <Link to="/flights">Flights</Link>
                    </div>
                </Link>

                <Link to="/hotels">
                    <div id='hotels' style={{ width: "200px", rowGap: "0px", margin: 5 }} className="dashboard-item">
                        <Link to="/hotels">Hotels</Link>
                    </div>
                </Link>

                <Link to="/offers">
                    <div id='offers' style={{ width: "200px", rowGap: "0px", margin: 5 }} className="dashboard-item">
                        <Link to="/offers">Offers</Link>
                    </div>
                </Link>

                <Link to="/destinations">
                    <div id='destinations' style={{ width: "200px", rowGap: "0px", margin: 5 }} className="dashboard-item">
                        <Link to="/destinations">Destinations</Link>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;