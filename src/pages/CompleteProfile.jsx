import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./completeProfile.css";

export default function CompleteProfile() {
  const [formData, setFormData] = useState({ fullName: "", email: "", gender: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call to update profile details here
    alert("Profile Created Successfully!");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="profile-bg">
      <div className="profile-card">
        <h2>Welcome</h2>
        <p>Help us know you better !</p>
        
        <form onSubmit={handleSubmit}>
          <label>Full Name <span className="req">*</span></label>
          <input type="text" placeholder="Your Full Name" required 
            onChange={(e) => setFormData({...formData, fullName: e.target.value})} />

          <label>Email Address (Optional)</label>
          <input type="email" placeholder="Your Email Address" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} />

          <div className="gender-row">
            <label>Gender <span className="req">*</span></label>
            <input type="radio" name="gender" value="Male" required onClick={() => setFormData({...formData, gender: "Male"})} /> Male
            <input type="radio" name="gender" value="Female" onClick={() => setFormData({...formData, gender: "Female"})} /> Female
          </div>

          <div className="date-fields">
            <div>
              <label>Date of Birth (Optional)</label>
              <input type="date" />
            </div>
            <div>
              <label>Anniversary (Optional)</label>
              <input type="date" />
            </div>
          </div>

          <button type="submit" className="submit-profile-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}