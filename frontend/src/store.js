import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { productsListReducer, productDetailsReducer, deleteProductReducer, createProductReducer, updateProductReducer } from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers.js'
import { userDeleteReducer, userDetailsReducer, userLoginReducer, userRegisterReducer, usersListReducer, userUpdateProfileReducer, userUpdateReducer } from './reducers/userReducers.js'
import { listMyOrdersReducer, listAllOrdersReducer, orderCreateReducer, orderDetailsReducer, orderPayReducer, orderDeliverReducer } from './reducers/orderReducers'

const reducer = combineReducers({
    cart: cartReducer,
    // products resources
    productsList: productsListReducer,
    productDetails: productDetailsReducer,
    createProduct: createProductReducer,
    updateProduct: updateProductReducer,
    deleteProduct: deleteProductReducer,
    // user resources
    usersList: usersListReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    // order resources
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderDeliver: orderDeliverReducer,
    listOrders: listMyOrdersReducer,
    listAllOrders: listAllOrdersReducer
    // add actions now
})

// if localStorage has cartItems, save those as initialState.
// convert the string stored in localStorage to JSON object using parse() method.
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []

// if localStorage has userInfo, save those as initialState.
const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initialState = {
    cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage },
    userLogin: { userInfo : userInfoFromStorage }
}

const middleware = [thunk]

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store