import React from 'react';
import './ProfileSetup.css'; // Reusing base styles

export default function EditProfile() {
  return (
    <div className="edit-profile-container">
      <div className="edit-card">
        <div className="edit-header">
          <button className="back-btn">←</button>
          <h2>Edit Profile</h2>
        </div>

        <div className="user-profile-summary">
          <h3 className="user-initials-name">Arya</h3>
          <p className="user-phone">+91 9324535230</p>
        </div>

        <form className="setup-form">
          <div className="input-field">
            <label>Full Name</label>
            <input type="text" defaultValue="Arya" />
          </div>

          <div className="input-field">
            <label>Email Address (Optional)</label>
            <input type="email" placeholder="Email" />
          </div>

          <div className="gender-row">
            <label>Gender</label>
            <div className="radio-group">
              <label><input type="radio" name="gender" /> Male</label>
              <label><input type="radio" name="gender" defaultChecked /> Female</label>
            </div>
          </div>

          <div className="date-row">
            <div className="input-field">
              <label>Date of Birth (Optional)</label>
              <input type="date" />
            </div>
            <div className="input-field">
              <label>Anniversary (Optional)</label>
              <input type="date" />
            </div>
          </div>

          <button type="button" className="update-btn">Update Changes</button>
        </form>
      </div>
    </div>
  );
}