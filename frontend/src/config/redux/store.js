import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

/*
 STEPS for State management
 
1. Submit action
2. Handle action in it's reducer
3. Register Here -> Reducer 
 
*/

export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
    }
});