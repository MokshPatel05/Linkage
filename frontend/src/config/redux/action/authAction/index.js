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