import { createSlice } from '@reduxjs/toolkit'
//we are using createSlice method for reducer instead of using createReducer method

//this is a reducer
//LOGIN, LOGOUT, SET_USER_INFO.. these are the different actions
export const userAuth = createSlice({
    name: 'userAuthentication',
    initialState: JSON.parse(localStorage.getItem("user")) || {
        user: null,
        isAuth: false,
        userInfo: null,
      },
    reducers: {
        LOGIN: (state, action) => {
            var dataLogin = {
                user: action.payload,
                isAuth: true,
              };
              localStorage.setItem("user", JSON.stringify(dataLogin));
              return dataLogin;
        },

        LOGOUT : (state, action) => {
            var dataLogout = {
                user: null,
                isAuth: false,
                userInfo: null,
              };
              localStorage.setItem("user", JSON.stringify(dataLogout));
              return dataLogout;
        },

        SET_USER_INFO : (state, action) => {
            var dataUpdate = {
                ...state,
                userInfo: action.payload,
              };
              localStorage.setItem("user", JSON.stringify(dataUpdate));
              return dataUpdate;
        }
    }
})

//exporting reducer and action separately
export const { LOGIN, LOGOUT, SET_USER_INFO } = userAuth.actions
export default userAuth.reducer