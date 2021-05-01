import axios from 'axios'
import { LIST_MY_ORDERS_RESET } from '../constants/orderConstants'
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_DETAILS_FAIL,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_REQUEST,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_DETAILS_RESET,
    USERS_LIST_FAIL,
    USERS_LIST_SUCCESS,
    USERS_LIST_REQUEST,
    USERS_LIST_RESET,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL
} from '../constants/userConstants'

// login action - makes a request to login and get the token
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        })
        // while actually sending data, in the headers we send a content-type.
        //  Indicates that the request body format is JSON.
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/users/login', { email, password }, config)
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })
        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        })
        // while actually sending data, in the headers we send a content-type.
        //  Indicates that the request body format is JSON.
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/users', { name, email, password }, config)
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })
        // log the user in after they register
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })
        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

// get user details
// getState lets us use userInfo from localStorage
export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DETAILS_REQUEST
        })

        // extract userLogin.userInfo in localStorage
        const { userLogin: { userInfo }} = getState()
        // while actually sending data, in the headers we send a content-type.
        const config = {
            headers: {
                'Content-Type': 'application/json', // indicates that the request body format is JSON.
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.get(`/api/users/${id}`, config)
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST
        })

        // extract userLogin.userInfo in localStorage
        const { userLogin: { userInfo }} = getState()
        // while actually sending data, in the headers we send a content-type.
        const config = {
            headers: {
                'Content-Type': 'application/json', // indicates that the request body format is JSON.
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.put(`/api/users/profile`, user, config) // user parameter is the paramter we want to update
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data
        })
        dispatch({ // update the info in localStorage and navbar
            type: USER_LOGIN_SUCCESS,
            payload: data
        })
        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const listUsers = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USERS_LIST_REQUEST
        })

        // extract userLogin.userInfo in localStorage
        const { userLogin: { userInfo }} = getState()
        // while actually sending data, in the headers we send a content-type.
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.get(`/api/users`, config) 
        dispatch({
            type: USERS_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: USERS_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DELETE_REQUEST
        })

        // extract userLogin.userInfo in localStorage
        const { userLogin: { userInfo }} = getState()
        // while actually sending data, in the headers we send a content-type.
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        await axios.delete(`/api/users/${id}`, config) 
        dispatch({
            type: USER_DELETE_SUCCESS
        })
    } catch (error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo') // remove user's info from local storage
    dispatch({ type: USER_LOGOUT }) // fire this action
    dispatch({ type: USER_DETAILS_RESET })  // clear user from state
    dispatch({ type: LIST_MY_ORDERS_RESET })    // clear user's orders from state
    dispatch({ type: USERS_LIST_RESET }) // clear users list
    
}

// load these initially in store.js
