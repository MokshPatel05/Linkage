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
            return thunkAPI.rejectWithValue("Login Thunk Failed : " + error.response.data);
        }
    }
);

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
            const responce = await clientServer.post("/register", {
                name: user.name,
                email: user.email,
                password: user.password
            })
            if (responce.data.token) {
                localStorage.setItem("token", responce.data.token);
            } else {
                return thunkAPI.rejectWithValue("Register Thunk Failed : Token not found");
            }
            return thunkAPI.fulfillWithValue(responce.data.token);
        } catch (error) {
            return thunkAPI.rejectWithValue("Register Thunk Failed : " + error.response.data);
        }
    }
)