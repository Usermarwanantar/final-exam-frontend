import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../UserProvider/UserProvider";
import "./flight.css";

const UpdateFlight = () => {
  const [offer, setOffer] = useState(null);
  const [destinations, setDestinations] = useState([]); // Add state for destinations
  const [airline, setAirline] = useState("");
  const [departure, setDeparture] = useState("");
  const [destinationId, setDestinationId] = useState(""); // Change to destinationId
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [price, setPrice] = useState("");
  const [offerId, setOfferId] = useState(null);
  const { flightId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/flights/${flightId}`, {
          withCredentials: true,
        });
        const flight = response.data;
        setAirline(flight.airline);
        setDeparture(flight.departure);
        setDestinationId(flight.destination.id); // Set destination ID
        setDepartureDate(flight.departureDate);
        setReturnDate(flight.returnDate);
        setPrice(flight.price);
        setOfferId(flight.offer?.id || null);
      } catch (error) {
        console.error("Error fetching flight details:", error);
      }
    };

    const fetchOffers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/flights/${flightId}`, {
          withCredentials: true,
        });
        const offerID = response.data.offerId;
        const result = await axios.get(`http://localhost:8080/admin/offer/${offerID}`, {
          withCredentials: true,
        });
        setOffer(result.data);
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
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    fetchFlightDetails();
    fetchOffers();
    fetchDestinations();
  }, [flightId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFlight = {
      airline,
      departure,
      destination: { id: parseInt(destinationId, 10) }, // Pass destination as an object with ID
      departureDate,
      returnDate,
      price: parseFloat(price),
      offer: { id: parseInt(offerId, 10) },
    };

    try {
      const response = await axios.put(`http://localhost:8080/api/flights/${flightId}`, updatedFlight, {
        withCredentials: true,
      });
      console.log("Flight updated successfully:", response.data);
      alert("Flight updated successfully!");
    } catch (err) {
      console.error("Error updating flight:", err);
      alert("Error updating flight. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="label">Update Flight</h2>
      <form onSubmit={handleSubmit}>
        <div className="form">
          <input
            type="text"
            placeholder="Airline"
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Departure"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            required
          />
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
            {offer && (
              <option key={offer.id} value={offer.id}>
                {offer.offerDetails} -- Id: {offer.id}
              </option>
            )}
          </select>
        </div>
        <button type="submit">Update Flight</button>
      </form>
    </div>
  );
};

export default UpdateFlight;