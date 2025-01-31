import { useEffect, useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import './Offers.css'
import { useUser } from "../UserProvider/UserProvider";


const Offers = () => {
    const [offers, setOffers] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();


    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        }, [user, navigate]);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const result = await axios.get("http://localhost:8080/admin/offers", {
                    withCredentials: true,
                });
                console.log("Offers:", result.data);
                setOffers(result.data);
            } catch (err) {
                console.error("Error fetching offers:", err);
            }
        };

        fetchOffers();
    }, []);

    const handleOfferDelete = async (id) => {
        try {
            const confirmation = window.confirm("Are you sure you want to delete this offer?");
            if (!confirmation) return;

            const response = await axios.delete(`http://localhost:8080/admin/offer/${id}`, {
                withCredentials: true,
            });

            if (response.status === 200) {
                setOffers(offers.filter(offer => offer.id !== id));
                alert("Offer deleted successfully!");
            }
        } catch (err) {
            console.error("Error while deleting the offer:", err);
            alert("Error while deleting the offer.");
        }
    };

    return (
        <div className="OffersList">
            <div>
                <Link to="/offers/add"><h3 className="addOffer">Add Offer</h3></Link>
            </div>
            <h2>Offers List</h2>
            {
                offers.length === 0
                    ? <p>Loading...</p>
                    : <table className="offerTab">
                        <thead>
                            <tr>
                                <th>Destination ID</th>
                                <th>Flight ID</th>
                                <th>Hotel ID</th>
                                <th>Offer Details</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                offers.map((offer) => (
                                    <tr key={offer.id}>
                                        <td>
                                            <Link to={`/destinations/${offer.destinationId}`}>
                                               <strong>Destination : {offer.destinationId}</strong>  <br />
                                            </Link>
                                        </td>
                                        <td>
                                            {offer.flightId ? (
                                                <Link to={`/flights/${offer.flightId}`}>
                                                    <strong>Flight: {offer.flightId}</strong>
                                                </Link>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td>
                                            {offer.hotelId ? (
                                                <Link to={`/hotels/${offer.hotelId}`}>
                                                    <strong>Hotel: {offer.hotelId}</strong>
                                                </Link>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td>{offer.offerDetails}</td>
                                        <td>{offer.offerPrice}</td>
                                        <td className="td">
                                            <Link to={`/offers/update/${offer.id}`}>
                                                <button>Edit</button>
                                            </Link>
                                            <button onClick={() => handleOfferDelete(offer.id)}>Delete</button>
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

export default Offers;