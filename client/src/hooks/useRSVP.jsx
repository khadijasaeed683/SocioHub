import { useState } from 'react';

const useRSVP = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');

  const handleRSVPClick = (event) => {
    setSelectedEvent(event);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/explore-events/${selectedEvent._id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
      } else {
        alert('✅ ' + data.message);
        setSelectedEvent(null);
        setFormData({ name: '', email: '', phone: '' });
      }
    } catch (error) {
      console.error(error);
      setError('Server error. Please try again later.');
    }
  };

  return {
    selectedEvent,
    setSelectedEvent,
    formData,
    setFormData,
    error,
    setError,
    handleRSVPClick,
    handleFormSubmit,
    handleInputChange,
  };
};

export default useRSVP;
