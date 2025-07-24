import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLoggedIn } from '../features/authSlice';

const useCurrentUser = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);

    console.log("useCurrentUser hook running. user:", user);

    console.log("Inside useEffect. Current user:", user);
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (token) {
        console.log("Fetching current user from backend...");
        fetch('http://localhost:5000/api/user/current', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch current user');
                return res.json();
            })
            .then(data => {
                console.log("Fetched user data:", data);
                dispatch(userLoggedIn(data));
                console.log("Dispatched userLoggedIn action");
            })

            .catch(err => console.error('Error fetching user:', err));
    }

    return user;
};

export default useCurrentUser;
