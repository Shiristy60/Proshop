import axios from 'axios'
import {
    ADD_ITEM,
    CART_SAVE_PAYMENT_METHOD,
    CART_SAVE_SHIPPING_ADDRESS,
    REMOVE_ITEM
} from '../constants/cartConstants'

// getState allows us to get the entire state tree.
export const addToCart = (id, qty) => async(dispatch, getState) =>{
    const { data } = await axios.get(`/api/products/${id}`)
    dispatch({
        type: ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    })
    // save the cartItems(entire cart) to the localStorage.
    // setItem gives a JSON object, therefore we call stringify method to convert it to string as, localStorage only stores strings.
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
    // now fill state with cartItems in store
}

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: REMOVE_ITEM,
        payload: id
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    })
    localStorage.setItem('shippingAddress', JSON.stringify(data))
}

export const savePaymentMethod = (paymentMethod) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: paymentMethod
    })
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod))
}