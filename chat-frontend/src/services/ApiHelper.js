import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";


const ApiHelper = createApi({
    reducerPath: 'ApiHelper',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000/api/v1'
    }),

    endpoints: (builder) => ({

        // signup
        signUpUser : builder.mutation({
            query: (user) => ({
                url : "/signup",
                method: "POST",
                body: user
            })
        }),

        //signin
        signInUser : builder.mutation({
            query: (user) => ({
                url : "/signin",
                method: "POST",
                body: user
            })
        }),

        // signout
        signOutUser : builder.mutation({
            query : (payload) => ({
                url : "/logout",
                method: "DELETE",
                body: payload
            })
        })
    })
})


export const {useSignInUserMutation, useSignUpUserMutation, useSignOutUserMutation} = ApiHelper;

export default ApiHelper;