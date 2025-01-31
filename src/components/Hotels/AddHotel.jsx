import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './hotel.css';
import { useUser } from "../UserProvider/UserProvider";

const AddHotel = () => {
    const [offers, setOffers] = useState([]);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [stars, setStars] = useState("");
    const [pricePerNight, setpricePerNight] = useState("");
    const [offerId, setOfferId] = useState(null);
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
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
                    (offer) => !offer.hotelId // Filter offers without flightId
                  );
                  setOffers(availableOffers);
                  if (availableOffers.length > 0) {
                    setOfferId(availableOffers[0].id); // Pre-select the first available offer
                  }
            } catch (error) {
                console.error("Error fetching offers:", error);
            }
        };

        fetchOffers();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Trim the location to remove any whitespace
        const trimmedLocation = location.trim();
        
        // Additional validation
        if (!trimmedLocation) {
            alert("Location cannot be empty");
            return;
        }
    
        try {
            const base64Image = previewUrl;
            
            const hotel = { 
                name: name.trim(), 
                location: trimmedLocation,  // Use trimmed location
                stars: parseInt(stars), 
                pricePerNight: parseFloat(pricePerNight), 
                offer: { id: parseInt(offerId) },
                imageUrl: base64Image 
            };
    
            console.log("Sending hotel data:", hotel); // Debug log
    
            const response = await axios.post("http://localhost:8080/api/hotels", hotel, {
                withCredentials: true,
            });
            
            if (response.data) {
                alert("Hotel added successfully!");
                // Reset form
                setName("");
                setLocation("");
                setStars("");
                setpricePerNight("");
                setImage(null);
                setPreviewUrl(null);
            }
        } catch (err) {
            console.error("Error adding hotel:", err.response?.data || err.message);
            alert("Error adding hotel: " + (err.response?.data || err.message));
        }
    };
    return (
        <div>
            <h2 className="label">Add Hotel</h2>
            <form className="AddForm" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Rating"
                    value={stars}
                    onChange={(e) => setStars(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={pricePerNight}
                    onChange={(e) => setpricePerNight(e.target.value)}
                    required
                />
                <select onChange={(e) => setOfferId(e.target.value)} value={offerId} required>
                    <option value="" disabled>-- Select an Offer --</option>
                    {offers.map((offer) => (
                        <option key={offer.id} value={offer.id}>{offer.id}--{offer.offerDetails}</option>
                    ))}
                </select>
                <div className="image-upload">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    {previewUrl && (
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            style={{ maxWidth: '200px', marginTop: '10px' }} 
                        />
                    )}
                </div>
                <button type="submit">Add Hotel</button>
            </form>
        </div>
    );
};

export default AddHotel;