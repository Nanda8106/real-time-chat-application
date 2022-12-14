import ApiHelper from "../services/ApiHelper";
import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: null,
    reducers : {
        addNotifications : (state, {payload}) => {
            if(state.newMessages[payload]){
                state.newMessages[payload] += 1;
            }else{
                state.newMessages[payload] = 1;
            }
        },
        resetNotifications : (state, {payload}) => {
            delete state.newMessages[payload]
        },
    },

    extraReducers : (builder) => {
        //save user after signup
        builder.addMatcher(ApiHelper.endpoints.signUpUser.matchFulfilled, (state, {payload}) => payload)
        // save user after signin
        builder.addMatcher(ApiHelper.endpoints.signInUser.matchFulfilled, (state, {payload}) => payload)
        // logout :: deleting user session
        builder.addMatcher(ApiHelper.endpoints.signOutUser.matchFulfilled, () => null);
    }
})

export const {addNotifications, resetNotifications} = userSlice.actions;
export default userSlice.reducer;