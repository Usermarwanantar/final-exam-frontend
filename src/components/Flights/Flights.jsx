import { useEffect, useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import './flight.css';
import { useUser } from "../UserProvider/UserProvider";


const Flights = () => {
    const [flights, setFlights] = useState([]);
    const [offerDetails, setOfferDetails] = useState({}); // Object to store offer descriptions
    const { user } = useUser();
    const navigate = useNavigate();
  
  
   useEffect(() => {
        if (!user) {
          navigate('/login');
        }
      }, [user, navigate]);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const result = await axios.get("http://localhost:8080/api/flights", {
                    withCredentials: true,
                });
                const data = result.data;
                console.log("Flights:", data);
                setFlights(data);

                // Fetch offer descriptions
                const offerDescriptions = {};
                for (const flight of data) {
                    if (flight.offerId) {
                        offerDescriptions[flight.offerId] = "Loading...";
                        fetchOfferDescription(flight.offerId, offerDescriptions);
                    }
                }
            } catch (err) {
                console.error("Error fetching flights:", err);
            }
        };

        const fetchOfferDescription = async (offerId, offerDescriptions) => {
            try {
                const url = `http://localhost:8080/admin/offer/${offerId}`;
                const result = await axios.get(url, {
                    withCredentials: true,
                });
                offerDescriptions[offerId] = result.data.offerDetails;
                setOfferDetails({ ...offerDescriptions });
            } catch (err) {
                console.error(`Error fetching offer description for ID ${offerId}:`, err);
                offerDescriptions[offerId] = "Error fetching data";
                setOfferDetails({ ...offerDescriptions });
            }
        };

        fetchFlights();
    }, []);

    const handleFlightDelete = async (id) => {
        try {
            const confirmation = window.confirm("Are you sure you want to delete this flight?");
            if (!confirmation) return;
    
            const response = await axios.delete(`http://localhost:8080/api/flights/${id}`, {
                withCredentials: true,
            });
    
            if (response.status === 200) {
                setFlights(flights.filter(flight => flight.id !== id));
                alert("Flight deleted successfully!");
            }
        } catch (err) {
            console.error("Error while deleting the flight:", err);
            if (err.response && err.response.status === 400) {
                // Display the error message from the backend
                alert(err.response.data);
            } else {
                alert("Error while deleting the flight.");
            }
        }
    };
    

    return (
        <div className="FlightsList">
            <div>
                <Link to="/flights/add"><h3 className="add">Add Flight</h3></Link>
            </div>
            <h2>Flights List</h2>
            {
                flights.length === 0
                    ? <p>Loading...</p>
                    : <table className="flightTab">
                        <thead>
                            <tr>
                                <th>Airline</th>
                                <th>Departure</th>
                                <th>Departure Date</th>
                                <th>Destination</th>
                                <th>Offer</th>
                                <th>Price</th>
                                <th>Return Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                flights.map((flight, index) => (
                                    <tr key={index}>
                                        <td>{flight.airline}</td>
                                        <td>{flight.departure}</td>
                                        <td>{flight.departureDate}</td>
                                        <td>
                                            <Link to={`/destinations/${flight.destinationId}`}>
                                               <strong>Destination : {flight.destinationId}</strong>  <br />
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/offers/${flight.offerId}`}>
                                               <strong>Offer : {flight.offerId}</strong>  <br />
                                            </Link>
                                        </td>
                                        <td>{flight.price}</td>
                                        <td>{flight.returnDate}</td>
                                        <td className="td">
                                            <Link to={`/flights/update/${flight.id}`}>
                                                <button >Edit</button>
                                            </Link>
                                            <button  onClick={() => handleFlightDelete(flight.id)}>Delete</button>
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

export default Flights;
