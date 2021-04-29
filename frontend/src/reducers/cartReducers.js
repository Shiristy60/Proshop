import {
    ADD_ITEM,
    CART_SAVE_PAYMENT_METHOD,
    CART_SAVE_SHIPPING_ADDRESS,
    REMOVE_ITEM
} from "../constants/cartConstants.js"

export const cartReducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
    switch (action.type) {
        case ADD_ITEM:
            const item = action.payload
            // check if item already exists in the cart
            const itemExists = state.cartItems.find(x => x.product === item.product)

            // if yes, return this item
            if (itemExists) {
                return {
                    ...state,
                    // x.product is an id
                    cartItems: state.cartItems.map(x => x.product === itemExists.product ? item : x)
                }
            } else {    // if no, add this item to the cart
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }
        case REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            }
        case CART_SAVE_SHIPPING_ADDRESS: {
            return {
                ...state,
                shippingAddress: action.payload
            }
        }
        case CART_SAVE_PAYMENT_METHOD: {
            return {
                ...state,
                paymentMethod: action.payload
            }
        }  
        default:
            return state
    }
}


// now add this to the store and create actions