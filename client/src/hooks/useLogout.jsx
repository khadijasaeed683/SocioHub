import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userLoggedOut } from '../features/authSlice'; // adjust path if needed
import { useState } from 'react';

const useLogout = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });

      // Just update Redux state
      dispatch(userLoggedOut());

    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogout, loading };
};

export default useLogout;
