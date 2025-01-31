
import { useEffect, useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import './Destinations.css';
import { useUser } from "../UserProvider/UserProvider";

const OneDestination = () => {
    const { id } = useParams();
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
  const navigate = useNavigate();


 useEffect(() => {
      if (!user) {
        navigate('/login');
      }
    }, [user, navigate]);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const result = await axios.get(`http://localhost:8080/admin/destination/${id}`, {
                    withCredentials: true,
                });
                setDestination(result.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching destination details:", err);
                setLoading(false);
            }
        };

        fetchDestination();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!destination) return <p>No details found for this destination.</p>;

    return (
        <div className="OneDestination">
            <h2>Destination Details</h2>
            <div>
                <h4>{destination.name}</h4>
                <h4><strong>Country:</strong> {destination.country}</h4>
                <h4><strong>Description:</strong> {destination.description}</h4>
            </div>
        </div>
    );
};

export default OneDestination