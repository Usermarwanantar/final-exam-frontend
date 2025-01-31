import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../UserProvider/UserProvider";
import { useNavigate } from "react-router-dom";
import './clientRes.css'

const ClientReservation = () => {
    const { offerId } = useParams();
    const { user } = useUser();
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!user) {
        navigate('/login');
      }
    }, [user, navigate]);

    // Add this function to handle file input changes
    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };
  
    const handleReservationSubmit = async () => {
      if (!file || !user?.id || !offerId) {
        alert("Please ensure you're logged in and have selected a file.");
        return;
      }
  
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("offerId", offerId);
      formData.append("file", file);
  
      try {
        const response = await axios.post(
          "http://localhost:8080/client/reservation",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
          }
        );
        alert(response.data);
        navigate('/dashboard'); 
      } catch (error) {
        console.error("Error creating reservation:", error);
        if (error.response) {
          // Backend returned an error response (e.g., 400, 500)
          alert(`Failed to create reservation: ${error.response.data}`);
        } else if (error.request) {
          // No response received from the backend
          alert("Failed to create reservation: No response from the server.");
        } else {
          // Something else went wrong
          alert("Failed to create reservation: Please try again later.");
        }
      }
    };
  
    return (
      <div className="reservation-form">
        <h1>Make a Reservation</h1>

         {/* RIB and money transfer instructions */}
         <div className="company-rib">
          <p>RIB Number: 12345678901234567890123456</p>
          <h3>Send money to this RIB and upload the receipt below.</h3>
        </div>

        <div className="form-group">
          <label>Upload Receipt</label>
          <input 
            type="file" 
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png" 
          />
        </div>
        <button 
          onClick={handleReservationSubmit}
          className="submit-button"
        >
          Submit Reservation
        </button>
      </div>
    );
  };

export default ClientReservation;