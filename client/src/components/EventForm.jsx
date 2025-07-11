import React from "react";
import './EventForm.css'; // ensure to create this CSS file

const EventForm = ({
  formData,
  setFormData,
  handleSubmit,
  isEditing,
  cancelForm
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-form-container">
        <h3>{isEditing ? 'Edit Event' : 'Create Event'}</h3>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date ? formData.date.slice(0,10) : ''}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="poster">Poster Image</label>
            <input
              type="file"
              id="poster"
              name="poster"
              accept="image/*"
              onChange={(e) => setFormData(prev => ({ ...prev, poster: e.target.files[0] }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            ></textarea>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic || false}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
            />
            <label htmlFor="isPublic">Public Event</label>
          </div>

          <div className="form-actions">
            <button type="submit">{isEditing ? 'Update' : 'Create'}</button>
            <button type="button" className="cancel-btn" onClick={cancelForm}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EventForm;
