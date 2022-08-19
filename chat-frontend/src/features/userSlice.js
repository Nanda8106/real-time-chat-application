import ApiHelper from "../services/ApiHelper";
import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers : {
        addNotifications : (state, {playload}) => {},
        resetNotifications : (state, {playload}) => {},
    },

    extraReducers : (builder) => {
        //save user after signup
        builder.addMatcher(ApiHelper.endpoints.signUpUser.matchFulfilled, (state, {playload}) => playload)
        // save user after signin
        builder.addMatcher(ApiHelper.endpoints.signInUser.matchFulfilled, (state, {playload}) => playload)
    }
})

export const {addNotifications, resetNotifications} = userSlice.actions;
export default userSlice.reducer;