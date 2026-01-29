import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/posts");

            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue("Somethig Went Wrong in getAllPosts Thunk" + error.response.data.message);
        }
    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkAPI) => {
        const { file, body } = userData;
        try {

            const formData = new FormData();
            formData.append("token", localStorage.getItem("token"));
            formData.append("body", body);
            formData.append("media", file);

            const response = await clientServer.post("/post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if(response.status === 200){
                return thunkAPI.fulfillWithValue("Post Created Successfully");
            }else{
                return thunkAPI.rejectWithValue("Post Not Created");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue("Somethig Went Wrong in createPost Thunk" + error.response.data.message);
        }
    }
)
