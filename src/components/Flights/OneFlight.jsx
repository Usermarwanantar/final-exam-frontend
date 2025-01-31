import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../UserProvider/UserProvider";

const OneFlight = () => {
    const { id } = useParams();
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const navigate = useNavigate();
  
  
    useEffect(() => {
        if (!user) {
          navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const result = await axios.get(`http://localhost:8080/api/flights/${id}`, {
                    withCredentials: true,
                });
                setFlight(result.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching flight details:", err);
                setLoading(false);
            }
        };

        fetchFlight();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!flight) return <p>No details found for this flight.</p>;

    return (
        <div>
            <h2>Flight Details</h2>
            <h4><strong>Airline:</strong> {flight.airline}</h4>
            <h4><strong>Departure:</strong> {flight.departure}</h4>
            <h4><strong>Destination:</strong> {flight.destinationId}</h4>
            <h4><strong>Departure Date:</strong> {flight.departureDate}</h4>
            <h4><strong>Return Date:</strong> {flight.returnDate}</h4>
            <h4><strong>Price:</strong> {flight.price} <strong>Dh</strong></h4>
        </div>
    );
};

export default OneFlight;