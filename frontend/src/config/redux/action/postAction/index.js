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

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue("Post Created Successfully");
            } else {
                return thunkAPI.rejectWithValue("Post Not Created");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue("Somethig Went Wrong in createPost Thunk" + error.response.data.message);
        }
    }
)

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (post_id, thunkAPI) => {
        try {
            const response = await clientServer.post("/delete_post", {
                token: localStorage.getItem("token"),
                post_id
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue("Post Deleted Successfully");
            } else {
                return thunkAPI.rejectWithValue("Post Not Deleted");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong in deletePost Thunk" + error.response.data.message);
        }
    }
)

export const increamentPostLikes = createAsyncThunk(
    "post/increamentLike",
    async (post, thunkAPI) => {
        try {
            const response = await clientServer.post(`/increament_post_likes`, {
                post_id: post.post_id
            })

            return thunkAPI.fulfillWithValue(response.data);


        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong in increamentPostLikes thunk" + error.response.data.message);
        }
    }
)

export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async (postData, thunkAPI) => {
        try {
            const response = await clientServer.get("/get_comment", {
                params: {
                    post_id: postData.post_id,
                }
            });

            return thunkAPI.fulfillWithValue({
                comments: response.data,
                post_id: postData.post_id
            });
        } catch (error) {
            return thunkAPI.rejectWithValue("Something Went Wrong in getAllComments thunk" + error.response.data.message);
        }
    })