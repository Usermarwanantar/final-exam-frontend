import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './style.css'
import axios from "axios";

const Register = () => {
    const [fullName,setfullName] = useState("");
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [role,setRole] = useState("");

    const navigate = useNavigate(); // redirect bin routes


    const setRoleChange =async (e) => {
        e.preventDefault();
        const selectedRole = e.target.value;
        setRole(selectedRole); 
    }
    const setUsernameChange = (e) => {
        e.preventDefault();
        setUsername(e.target.value)
    }
    const setFullNameChange = (e) => {
        e.preventDefault();
        setfullName(e.target.value)
    }
    const setPasswordChange = (e) => {
        e.preventDefault();
        setPassword(e.target.value)
    }
    const handleFormeSubmit =async (e) => {
        e.preventDefault();
        const url = `http://localhost:8080/auth/register?username=${encodeURIComponent(username)}&fullName=${encodeURIComponent(fullName)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(role)}`;
        console.log("url : "+url)
        try {
            const result =await axios.post(url);
            const data = result.data;
            console.log("register response data: "+data.message)
            alert("Registration successful: "); 
            setfullName("")
            setPassword("");
            setRole("");
            setUsername("");
            if(role==="ROLE_CLIENT") {
                navigate("/dashboard");
            }
            else {
                navigate("/admin-dashboard");
            }

        }
        catch(err) {
            console.error("error: "+err)
            alert("Error whie submiting")
        }

    }
    const handleLoginRedirect = async (e) => {
        navigate("/login");
    };

    return(
        <>
        <h2 className="reg">Register</h2>
        <form className="form" onSubmit={handleFormeSubmit}>
            <input type="text" name="" id="" placeholder="Full name" value={fullName} onChange={setFullNameChange} />
            <input type="text" name="" id="" placeholder="Email" value={username} onChange={setUsernameChange} />
            <input type="password" name="" id="" placeholder="password" value={password} onChange={setPasswordChange}/>
            <select onChange={setRoleChange} value={role} name="" id="">
                <option value="" disabled>
                 -- Sélectionnez un role --
                 </option>
                <option value="ROLE_CLIENT">ROLE_CLIENT</option>
                <option value="ROLE_ADMIN">ROLE_ADMIN</option>
            </select>
            <h3 className="selecteRole">Selected Role: <span className="role">{role}</span></h3>
            <button type="submit">Register</button>
            <button type="button" onClick={handleLoginRedirect}>Login</button>
        </form>

        </>
    )
}
export default Register;