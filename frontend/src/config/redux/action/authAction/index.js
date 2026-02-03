import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/login", {
                email: user.email,
                password: user.password
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            } else {
                return thunkAPI.rejectWithValue("Login Thunk Failed : Token not found");
            }
            return thunkAPI.fulfillWithValue(response.data.token);
        } catch (error) {
            return thunkAPI.rejectWithValue("Login Thunk Failed : " + error.response.data.Message);
        }
    }
);

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
            const responce = await clientServer.post("/register", {
                username: user.username,
                name: user.name,
                email: user.email,
                password: user.password
            })
            return thunkAPI.fulfillWithValue(responce.data);
        } catch (error) {
            return thunkAPI.rejectWithValue("Register Thunk Failed : " + error.response.data.Message);
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get("/get_user_and_profile", {
                params: {
                    token: user.token,
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue("getAboutUser Thunk Failed : " + error.response.data.Message);
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/user/get_all_users_profiles");
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue("getAllUsers Thunk Failed : " + error.response.data.Message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "user/logout",
    async (_, thunkAPI) => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (token) {
                await clientServer.post("/logout", { token });
            }
        } catch (_) {
            // Always clear client state even if server logout fails (e.g. network)
        } finally {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
            }
        }
    }
);