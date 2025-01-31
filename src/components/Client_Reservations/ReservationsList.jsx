import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../UserProvider/UserProvider';
import { useNavigate } from 'react-router-dom';
import './ReservationsList.css'

const ReservationsList = () => {
    const [reservations, setReservations] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchReservations = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/client/reservations/${user.id}`,
                    { withCredentials: true }
                );
                setReservations(response.data);
                console.log('Reservations:', response.data);
            } catch (error) {
                console.error('Error fetching reservations:', error);
                alert('Failed to fetch reservations');
            }
        };

        fetchReservations();
    }, [user, navigate]);

    return (
        <div className="ReservationsList">
            <h2>My Reservations</h2>
            {reservations.length === 0 ? (
                <p>No reservations found.</p>
            ) : (
                <table className="reservationTab">
                    <thead>
                        <tr>
                            <th>Reservation</th>
                            <th>Date</th>
                            <th>Destination</th>
                            <th>Hotel</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => (
                            <tr key={reservation.id}>
                                <td>{reservation.id}</td>
                                <td>{reservation.reservationDate}</td>
                                <td>{reservation.destinationName}</td>
                                <td>{reservation.hotelName}</td>
                                <td>{reservation.price} <strong>Dh</strong></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ReservationsList;