import {
    PRODUCT_LIST_FAIL,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_REQUEST,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_REQUEST
} from '../constants/productConstants.js'

// reducer takes two parameters - initial state and action
export const productsListReducer = (state = { products: [] }, action) => {
    switch (action.type) {
        case PRODUCT_LIST_REQUEST:  // make a request for products
            return { loading: true, products: [] }
        case PRODUCT_LIST_SUCCESS:  // a successful response from server
            return { loading: false, products: action.payload }
        case PRODUCT_LIST_FAIL:     // a failed response(error) from server
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const productDetailsReducer = (state = { product: { reviews: []} }, action) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return { loading: true, ...state }
        case PRODUCT_DETAILS_SUCCESS:
            return { loading: false, product: action.payload }
        case PRODUCT_DETAILS_FAIL:
            return { laoding: false, error: action.payload }
        default:
            return state
    }
}

// add reducers to the store.