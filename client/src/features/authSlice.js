import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false
};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        userLoggedOut: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { userLoggedIn, userLoggedOut, setUser } = authSlice.actions;
export default authSlice.reducer;
