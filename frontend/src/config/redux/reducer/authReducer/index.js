import { loginUser, registerUser, getAboutUser, getAllUsers, getMyConnections, getIncomingConnectionRequests, getMyConnectionRequests, sendConnectionRequest, respondToConnectionRequest } from "../../action/authAction/index.js"
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: null,
    token: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connections: [], // accepted connections
    all_users: [],
    connectionRequests: [], // incoming pending requests
    sentConnectionRequests: [], // requests I have sent
    all_profile_fetched: false,
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
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true;
        },
        setIsTokenIsNotThere: (state) => {
            state.isTokenThere = false;
        },
        setTokenFromStorage: (state, action) => {
            state.token = action.payload;
            state.isTokenThere = !!action.payload; // Clever use of !! to turn string into boolean
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
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = false;
                state.token = null;
                state.message = "Registration successful. Please log in."
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.loggedIn = false;
                state.message = action.payload;
            })
            //getAboutUser
            .addCase(getAboutUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Getting user data..."
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.user = action.payload.userProfile;
                state.profileFetched = true;
                state.message = "Get user data successful"
            })
            .addCase(getAboutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.loggedIn = false;
                state.message = action.payload;
            })
            //get all users
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.all_users = action.payload.profiles;
                state.all_profile_fetched = true;
                state.message = "Get user data successful"
            })

            // --- Connection related reducers ---

            // My accepted connections
            .addCase(getMyConnections.fulfilled, (state, action) => {
                state.connections = action.payload;
            })

            // Requests I have sent
            .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
                state.sentConnectionRequests = action.payload;
            })

            // Requests I have received
            .addCase(getIncomingConnectionRequests.fulfilled, (state, action) => {
                state.connectionRequests = action.payload;
            })

            // When I send a request successfully, optimistically push to sentConnectionRequests
            .addCase(sendConnectionRequest.fulfilled, (state, action) => {
                // We don't have full user object here; lists will be refreshed separately.
                // For now just leave state as-is and rely on refetch thunks where needed.
                state.message = action.payload.message;
            })

            // When I accept / reject, we will usually refetch lists in UI.
            .addCase(respondToConnectionRequest.fulfilled, (state, action) => {
                state.message = action.payload.message;
            })
    }
});

export const { reset, handleLoginUser, clearMessage, setTokenIsThere, setIsTokenIsNotThere, setTokenFromStorage } = authSlice.actions;
export default authSlice.reducer;