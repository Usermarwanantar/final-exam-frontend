import axios from "axios";
import { useEffect, useState } from "react";
import "./flight.css";
import { useUser } from "../UserProvider/UserProvider";
import { useNavigate } from "react-router-dom";

const AddFlight = () => {
  const [offers, setOffers] = useState([]);
  const [destinations, setDestinations] = useState([]); // Add state for destinations
  const [airline, setAirline] = useState("");
  const [departure, setDeparture] = useState("Casablanca Airport"); // Default to "Casablanca Airport"
  const [destinationId, setDestinationId] = useState(""); // Change to destinationId
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [price, setPrice] = useState("");
  const [offerId, setOfferId] = useState(null);
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
        const availableOffers = result.data.filter(
          (offer) => !offer.flightId // Filter offers without flightId
        );
        setOffers(availableOffers);
        if (availableOffers.length > 0) {
          setOfferId(availableOffers[0].id); // Pre-select the first available offer
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    const fetchDestinations = async () => {
      try {
        const result = await axios.get("http://localhost:8080/admin/destinations", {
          withCredentials: true,
        });
        setDestinations(result.data);
        if (result.data.length > 0) {
          setDestinationId(result.data[0].id); // Pre-select the first destination
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    fetchOffers();
    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const flight = {
        airline,
        departure,
        destination: { id: parseInt(destinationId, 10) }, // Pass destination as an object with ID
        departureDate,
        returnDate,
        price: parseFloat(price),
        offerId: parseInt(offerId, 10), // Send only the offerId
    };

    try {
        const response = await axios.post("http://localhost:8080/api/flights", flight, {
            withCredentials: true,
        });
        console.log("Flight added successfully:", response.data);
        alert("Flight added successfully!");
        setAirline("");
        setDeparture("");
        setDestinationId("");
        setDepartureDate("");
        setReturnDate("");
        setPrice("");
        setOfferId(null);
    } catch (err) {
        console.error("Error adding flight:", err);
        alert("Error adding flight. Please try again.");
    }
};
  return (
    <div>
      <h2 className="label">Add Flight</h2>
      <form onSubmit={handleSubmit}>
        <div className="form">
          <input
            type="text"
            placeholder="Airline"
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            required
          />
          <label htmlFor="departure">Departure:</label>
          <select
            id="departure"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            required
          >
            <option value="Casablanca Airport">Casablanca Airport</option>
          </select>

          <label htmlFor="destination">Destination:</label>
          <select
          id="destination" 
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
            type="datetime-local"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <select
            onChange={(e) => setOfferId(e.target.value)}
            value={offerId}
            required
          >
            <option value="" disabled>
              -- Select an Offer --
            </option>
            {offers.map((offer) => (
              <option key={offer.id} value={offer.id}>
                {offer.offerDetails} -- Id: {offer.id}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Add Flight</button>
      </form>
    </div>
  );
};

export default AddFlight;