// actions related to products
import axios from 'axios'
import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    PRODUCT_DELETE_REQUEST
} from '../constants/productConstants.js'

// make an asynchronized request.
export const listProducts = () => async (dispatch) => {
    try {
        // calls in the reducer the corresponsng action.type case and set loading to true.
        dispatch({ type: PRODUCT_LIST_REQUEST })

        const { data } = await axios.get('/api/products')

        // calls in the reducer the corresponding action.type case and set loading to false and loads the products in the data variable that we fetched from our axios request.
        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        // if we get an error from our server
        dispatch({
            type: PRODUCT_LIST_FAIL,
            // get our error essgae from our custom error handling in our backend.
            // error.response.data.message - our custom message in backend.
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}

export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })
        
        const { data } = await axios.get(`/api/products/${id}`)

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })
    }
    catch(error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }

}

export const productDelete = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: PRODUCT_DELETE_REQUEST
        })

        // extract userLogin.userInfo in localStorage
        const { userLogin: { userInfo }} = getState()
        // while actually sending data, in the headers we send a content-type.
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        await axios.delete(`/api/products/${id}`, config) 
        dispatch({
            type: PRODUCT_DELETE_SUCCESS
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
        })
    }
}

// fire these actions from our homescreen.