import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const useRSVP = (onSuccessCallback) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.contact || '' // or use profile.phone, if phone is nested
      });
    }
  }, [currentUser]);
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
        toast.info(data.message);
      } else {
        toast.success('✅ ' + data.message);
        setSelectedEvent(null);
        if (onSuccessCallback) onSuccessCallback();
        setFormData({ name: '', email: '', phone: '' });
      }
    } catch (error) {
      console.error(error);
      setError('Server error. Please try again later.');
      toast.error(error);
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
