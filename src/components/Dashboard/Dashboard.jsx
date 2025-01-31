import { Link } from 'react-router-dom';
import './style.css'; 
import { useUser } from "../UserProvider/UserProvider";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { logout } from '../utils/auth';
import Navbar from '../Navbar';



const Dashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <div className='dash1'>
            <Navbar />    
            <div className="dashboard">
                <div className='welcomewelcome'>
                    <h3 className='welcomeh3'>
                        Welcome <br /> here you can find offers and make or check reservations
                    </h3>
                </div>

                <Link to="/client-offers">
                    <div id='offers' style={{ width: "250px", rowGap: "0px", margin: 0 }} className="dashboard-item">
                        <Link to="/client-offers">Offers</Link>
                    </div>
                </Link>

                <Link to="/client-reservations">
                    <div id='reservations' className="dashboard-item">
                        <Link to="/client-reservations">Reservations</Link>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;