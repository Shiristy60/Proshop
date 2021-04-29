import {
    USERS_LIST_FAIL,
    USERS_LIST_REQUEST,
    USERS_LIST_RESET,
    USERS_LIST_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_RESET,
    USER_DETAILS_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_RESET,
    USER_UPDATE_PROFILE_SUCCESS
} from "../constants/userConstants"

// reducer takes two parameters - initial state and action
export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:  // make a request for user
            return { loading: true}
        case USER_LOGIN_SUCCESS:  // a successful response from server
            return { loading: false, userInfo: action.payload }
        case USER_LOGIN_FAIL:     // a failed response(error) from server
            return { loading: false, error: action.payload }
        case USER_LOGOUT:
            return {}
        default:
            return state
    }
}

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:  // make a request for user
            return { loading: true}
        case USER_REGISTER_SUCCESS:  // a successful response from server
            return { loading: false, userInfo: action.payload }
        case USER_REGISTER_FAIL:     // a failed response(error) from server
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

// initial state is an empty object
export const userDetailsReducer = (state = { user: {}}, action) => {
    switch (action.type) {
        case USER_DETAILS_REQUEST:  // make a request for user
            return {...state, loading: true}
        case USER_DETAILS_SUCCESS:  // a successful response from server
            return { loading: false, user: action.payload }
        case USER_DETAILS_FAIL:     // a failed response(error) from server
            return { loading: false, error: action.payload }
        case USER_DETAILS_RESET:
            return { user: {} }
        default:
            return state
    }
}

export const userUpdateProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_PROFILE_REQUEST:  // make a request for user
            return {loading: true}
        case USER_UPDATE_PROFILE_SUCCESS:  // a successful response from server
            return { loading: false, success: true, userInfo: action.payload }
        case USER_UPDATE_PROFILE_FAIL:     // a failed response(error) from server
            return { loading: false, error: action.payload }
        case USER_UPDATE_PROFILE_RESET:
            return {}
        default:
            return state
    }
}

export const usersListReducer = (state = {users: []}, action) => {
    switch (action.type) {
        case USERS_LIST_REQUEST:  // make a request for user
            return {loading: true}
        case USERS_LIST_SUCCESS:  // a successful response from server
            return { loading: false, users: action.payload }
        case USERS_LIST_FAIL:     // a failed response(error) from server
            return { loading: false, error: action.payload }
            case USERS_LIST_RESET:     // a failed response(error) from server
            return {users: []}
        default:
            return state
    }
}

// import this into store.js
