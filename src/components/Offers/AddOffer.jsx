import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../UserProvider/UserProvider";
import { useNavigate } from "react-router-dom";

const AddOffer = () => {
    const [destinations, setDestinations] = useState([]);
    const [destinationId, setDestinationId] = useState("");
    const [offerDetails, setOfferDetails] = useState("");
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
                setDestinations(result.data);
                if (result.data.length > 0) {
                    setDestinationId(result.data[0].id);
                }
            } catch (error) {
                console.error("Error fetching destinations:", error);
            }
        };

        fetchDestinations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const offer = {
            destination: {
                id: parseInt(destinationId, 10)
            },
            offerDetails
        };

        try {
            const response = await axios.post("http://localhost:8080/admin/offer", offer, {
                withCredentials: true,
            });
            console.log("Offer added successfully:", response.data);
            alert(`Offer added successfully! Price: ${response.data.offerPrice}`);
            setDestinationId("");
            setOfferDetails("");
        } catch (err) {
            console.error("Error adding offer:", err);
            alert("Error adding offer. Please try again.");
        }
    };

    return (
        <div>
            <h2 className="label">Add Offer</h2>
            <form onSubmit={handleSubmit}>
                <div className="form">
                    <select
                        value={destinationId}
                        onChange={(e) => setDestinationId(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            -- Select a Destination --
                        </option>
                        {destinations.map((destination) => (
                            <option key={destination.id} value={destination.id}>
                                {destination.name} - {destination.country}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Offer Details"
                        value={offerDetails}
                        onChange={(e) => setOfferDetails(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Offer</button>
            </form>
        </div>
    );
};

export default AddOffer;