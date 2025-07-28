import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userLoggedOut } from '../features/authSlice'; // adjust path if needed
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend to clear the cookie
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });

      // Clear Redux state
      dispatch(userLoggedOut());

      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return handleLogout;
};

export default useLogout;
