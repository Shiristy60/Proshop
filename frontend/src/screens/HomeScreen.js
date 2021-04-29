import React, { useEffect } from 'react'
// useSelector reads a value from the store state and subscribes to updates
// useDispatch returns the store's dispatch method to let you dispatch actions.
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product.js'
import Loader from '../components/Loader.js'
import Message from '../components/Message.js'
import { listProducts } from '../actions/productActions'

// React hooks allow your React components to interact with the Redux store.
const HomeScreen = () => {
    // to dispatch(call) listProduct action we need useDispatch
    // we are here using hooks. Instead of using connect, we use useDispatch here, which saves our time of using mapStateToProps
    const dispatch = useDispatch()

    // to use parts of state we need useSelector.
    // useSelector takes an arrow function, it takes in state and what part of state we want.
    const productList = useSelector(state => state.productList)
    const { loading, error, products} = productList // destructuring and using the desired data from productList.

    // runs as soon as the component loads
    useEffect(() => {
       dispatch(listProducts())
    }, [dispatch])

    return (
        <>
            <h1>Latest Products</h1>
            { loading ? (
                <Loader/>
            ) : error ? (
                <Message variant = 'danger'>{error}</Message>
            ) : (
                    <Row>
                        {products.map(product => (
                            <Col key={ product._id} sm={2} md={6} lg={4} xl={3}>
                                <Product product={product}/>
                            </Col>
                        ))}   
                    </Row>
                )
            }
        </>
    )
}

export default HomeScreen
