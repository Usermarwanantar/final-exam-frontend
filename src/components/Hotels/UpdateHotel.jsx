import axios from "axios";
import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import "./hotel.css";
import { useUser } from "../UserProvider/UserProvider";

const UpdateHotel = () => {
  const [offer, setOffer] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [stars, setStars] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [offerId, setOfferId] = useState(null);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { hotelId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();


  useEffect(() => {
      if (!user) {
        navigate('/login');
      }
    }, [user, navigate]);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/hotels/${hotelId}`, {
          withCredentials: true,
        });
        const hotel = response.data;
        setName(hotel.name);
        setLocation(hotel.location);
        setStars(hotel.stars);
        setPricePerNight(hotel.pricePerNight);
        setOfferId(hotel.offerId || null);
        setPreviewUrl(hotel.imageUrl);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
      }
    };
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setImage(file);
          const reader = new FileReader();
          reader.onloadend = () => {
              setPreviewUrl(reader.result);
          };
          reader.readAsDataURL(file);
      }
  };

    const fetchOffer = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/admin/offer/${offerId}`, {
          withCredentials: true,
        });
        setOffer(response.data);
      } catch (error) {
        console.error("Error fetching offer:", error);
      }
    };

    fetchHotelDetails();
    if (offerId) {
      fetchOffer();
    }
  }, [hotelId, offerId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedHotel = {
        name,
        location,
        stars: parseFloat(stars),
        pricePerNight: parseFloat(pricePerNight),
        offer: { id: parseInt(offerId, 10) },
        imageUrl: previewUrl
    };

    try {
        const response = await axios.put(`http://localhost:8080/api/hotels/${hotelId}`, updatedHotel, {
            withCredentials: true,
        });
        console.log("Hotel updated successfully:", response.data);
        alert("Hotel updated successfully!");
    } catch (err) {
        console.error("Error updating hotel:", err);
        alert("Error updating hotel. Please try again.");
    }
};
  return (
    <div>
      <h2 className="label">Update Hotel</h2>
      <form onSubmit={handleSubmit}>
        <div className="Updateform">
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
            onChange={(e) => setPricePerNight(e.target.value)}
            required
          />
          <select onChange={(e) => setOfferId(e.target.value)} value={offerId} required>
            <option value="" disabled>
              -- Select an Offer --
            </option>
            {offer && (
              <option key={offer.id} value={offer.id}>
                {offer.offerDetails} -- ID: {offer.id}
              </option>
            )}
          </select>
          <div className="image-upload">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {previewUrl && (
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            style={{ maxWidth: '200px', marginTop: '10px' }} 
                        />
                    )}
                </div>
        </div>
        <button type="submit">Update Hotel</button>
      </form>
    </div>
  );
};

export default UpdateHotel;
