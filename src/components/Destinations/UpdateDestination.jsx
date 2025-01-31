
import { useEffect, useState } from "react";
import axios from "axios";
import { Link,useNavigate,useParams } from "react-router-dom";
import './Destinations.css';
import { useUser } from "../UserProvider/UserProvider";

const UpdateDestination = () => {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("");
    const { user } = useUser();
    const navigate = useNavigate();


    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        }, [user, navigate]);

    useEffect(() => {
        const fetchDestinationDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/admin/destination/${id}`, {
                    withCredentials: true,
                });
                const destination = response.data;
                setName(destination.name);
                setDescription(destination.description);
                setCountry(destination.country);
            } catch (error) {
                console.error("Error fetching destination details:", error);
            }
        };

        fetchDestinationDetails();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedDestination = {
            name,
            description,
            country,
        };

        try {
            const response = await axios.put(`http://localhost:8080/admin/destination/${id}`, updatedDestination, {
                withCredentials: true,
            });
            console.log("Destination updated successfully:", response.data);
            alert("Destination updated successfully!");
        } catch (err) {
            console.error("Error updating destination:", err);
            alert("Error updating destination. Please try again.");
        }
    };

    return (
        <div className="UpdateDestination">
            <h2 className="label">Update Destination</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Country:</label>
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Update Destination</button>
            </form>
        </div>
    );
};

export default UpdateDestination;