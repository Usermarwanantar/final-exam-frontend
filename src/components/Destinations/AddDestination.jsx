
import { useEffect, useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import './Destinations.css';
import { useUser } from "../UserProvider/UserProvider";

const AddDestination = () => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const destination = {
            name,
            description,
            country,
        };

        try {
            const response = await axios.post("http://localhost:8080/admin/destination", destination, {
                withCredentials: true,
            });
            console.log("Destination added successfully:", response.data);
            alert("Destination added successfully!");
            setName("");
            setDescription("");
            setCountry("");
        } catch (err) {
            console.error("Error adding destination:", err);
            alert("Error adding destination. Please try again.");
        }
    };

    return (
        <div className="AddDestination">
            <h2 className="label">Add Destination</h2>
            <form className="AddForm" onSubmit={handleSubmit}>
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
                <button type="submit">Add Destination</button>
            </form>
        </div>
    );
};

export default AddDestination;