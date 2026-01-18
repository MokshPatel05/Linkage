import { loginUser, registerUser } from "../../action/authAction/index.js"
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequests: [],
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "Hello"
        },
        clearMessage: (state) => {
            state.message = ""
        }
    },

    extraReducers: (builder) => {
        builder
            //Login User
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Logging in..."
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.token = action.payload;
                state.message = "Login successful"
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.loggedIn = false;
                state.message = action.payload;
            })
            
            //Register User
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Registering in..."
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.token = action.payload;
                state.message = "Register successful"
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.loggedIn = false;
                state.message = action.payload;
            })
    }
});

export const { reset, handleLoginUser, clearMessage } = authSlice.actions;
export default authSlice.reducer;