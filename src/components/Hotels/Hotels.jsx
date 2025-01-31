import { useEffect, useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import './hotel.css';
import { useUser } from "../UserProvider/UserProvider";

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [offerDetails, setOfferDetails] = useState({}); 
    const { user } = useUser();
    const navigate = useNavigate();


  useEffect(() => {
      if (!user) {
        navigate('/login');
      }
    }, [user, navigate]);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const result = await axios.get("http://localhost:8080/api/hotels", {
                    withCredentials: true,
                });
                const data = result.data;
                setHotels(data);
                console.log("hotels : "+data)

                const offerDescriptions = {};
                for (const hotel of data) {
                    if (hotel.offerId) {
                        offerDescriptions[hotel.offerId] = "Loading...";
                        fetchOfferDescription(hotel.offerId, offerDescriptions);
                    }
                }
            } catch (err) {
                console.error("Error fetching hotels:", err);
            }
        };

        const fetchOfferDescription = async (offerId, offerDescriptions) => {
            try {
                const result = await axios.get(`http://localhost:8080/admin/offer/${offerId}`, {
                    withCredentials: true,
                });
                offerDescriptions[offerId] = result.data.offerDetails;
                setOfferDetails({ ...offerDescriptions });
            } catch (err) {
                console.error(`Error fetching offer for ID ${offerId}:`, err);
                offerDescriptions[offerId] = "Error fetching data";
                setOfferDetails({ ...offerDescriptions });
            }
        };

        fetchHotels();
    }, []);

    const handleHotelDelete = async (id) => {
        try {
            const confirmation = window.confirm("Are you sure you want to delete this hotel?");
            if (!confirmation) return;
    
            const response = await axios.delete(`http://localhost:8080/api/hotels/${id}`, {
                withCredentials: true,
            });
    
            if (response.status === 200) {
                setHotels(hotels.filter(hotel => hotel.id !== id));
                alert("Hotel deleted successfully!");
            }
        } catch (err) {
            console.error("Error deleting hotel:", err);
            if (err.response && err.response.status === 400) {
                // Display the error message from the backend
                alert(err.response.data);
            } else {
                alert("Error deleting hotel.");
            }
        }
    };

    return (
        <div className="HotelsList">
            <div>
                <Link to="/hotels/add"><h3 className="add">Add Hotel</h3></Link>
            </div>
            <h2 className="List">Hotels List</h2>
            {
                hotels.length === 0
                    ? <p>Loading...</p>
                    : <table className="hotelTab">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Rating</th>
                                <th>Offer</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotels.map((hotel, index) => (
                                <tr key={index}>
                                    <td>
                                        {hotel.imageUrl ? (
                                            <img 
                                                src={hotel.imageUrl} 
                                                alt={hotel.name}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div>No image</div>
                                        )}
                                    </td>
                                    <td>{hotel.name}</td>
                                    <td>{hotel.location}</td>
                                    <td>{hotel.stars}</td>
                                    <td>
                                        <Link to={`/offers/${hotel.offerId}`}>
                                        <strong>Offer : {hotel.offerId}</strong>  <br />
                                        </Link>
                                    </td>
                                    <td>{hotel.pricePerNight} <strong>Dh</strong></td>
                                    <td className="td">
                                        <Link to={`/hotels/update/${hotel.id}`}>
                                            <button>Edit</button>
                                        </Link>
                                        <button onClick={() => handleHotelDelete(hotel.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            }
        </div>
    );
};

export default Hotels;
