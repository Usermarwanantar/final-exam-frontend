

import { useEffect, useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import './Destinations.css';
import { useUser } from "../UserProvider/UserProvider";

const Destinations = () => {
    const [destinations, setDestinations] = useState([]);
    const { user } = useUser();
  const navigate = useNavigate();


 useEffect(() => {
      if (!user) {
        navigate('/login');
      }
    }, [user, navigate]);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const result = await axios.get("http://localhost:8080/admin/destinations", {
                    withCredentials: true,
                });
                console.log("Destinations:", result.data);
                setDestinations(result.data);
            } catch (err) {
                console.error("Error fetching destinations:", err);
            }
        };

        fetchDestinations();
    }, []);

    const handleDestinationDelete = async (id) => {
        try {
            const confirmation = window.confirm("Are you sure you want to delete this destination?");
            if (!confirmation) return;

            const response = await axios.delete(`http://localhost:8080/admin/destination/${id}`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                setDestinations(destinations.filter(destination => destination.id !== id));
                alert("Destination deleted successfully!");
            }
        } catch (err) {
            console.error("Error while deleting the destination:", err);
            alert("Error while deleting the destination.");
        }
    };

    return (
        <div className="DestinationsList">
            <div>
                <Link to="/destinations/add"><h3 className="add">Add Destination</h3></Link>
            </div>
            <h2>Destinations List</h2>
            {
                destinations.length === 0
                    ? <p>Loading...</p>
                    : <table className="DestTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Country</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                destinations.map((destination) => (
                                    <tr key={destination.id}>
                                        <td>{destination.name}</td>
                                        <td>{destination.country}</td>
                                        <td>{destination.description}</td>
                                        <td className="td">
                                            <Link to={`/destinations/update/${destination.id}`}>
                                                <button>Edit</button>
                                            </Link>
                                            <button onClick={() => handleDestinationDelete(destination.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
            }
        </div>
    );
};

export default Destinations;