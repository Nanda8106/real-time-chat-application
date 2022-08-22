import {configureStore} from "@reduxjs/toolkit";
import ApiHelper from "./services/ApiHelper";
import userSlice from "./features/userSlice";

// persit our store
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import {persistReducer} from "redux-persist";
import thunk from "redux-thunk";

// reducer
const reducer = combineReducers({
    user : userSlice,
    [ApiHelper.reducerPath] : ApiHelper.reducer
})

const persistConfig  = {
    key : "root",
    storage,
    blackList : [ApiHelper.reducerPath]
}

// persisting store
const persistedReducer = persistReducer(persistConfig, reducer)

// creating the store
const store = configureStore({
    reducer : persistedReducer,
    middleware: [thunk, ApiHelper.middleware]
})

export default store;