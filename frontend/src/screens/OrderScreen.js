import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader.js'
import Message from '../components/Message.js'
import { deliverOrder, getOrderDetails, payOrder } from '../actions/orderActions.js'
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants.js'

const OrderScreen = ({ match, history }) => {

    const orderId = match.params.id
    
    const [sdkReady, setSdkReady] = useState(false)

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay
    
    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver

    if (!loading) {
        // add decimals till 2 places
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }

        // Calculate price
        order.itemsPrice = addDecimals(
            order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
        )
    }

    // check for the order and also make sure that the order ID matches the ID in the URL. If it does not, then dispatch getOrderDetails() to fetch the most recent order
    useEffect(() => {

        // if no user
        if (!userInfo) {
            history.push('/login')
        }

        // to include PayPal, we need to include paypal sdk script
        // dynamically creating sdk script
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')    // fetch client id from backend
            const script = document.createElement('script') // create new script
            script.type = 'text/javascript' // add type
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`  // sdk script src
            script.async = true
            script.onload = () => {
                setSdkReady(true)  // once the script loads, set sdkReady to true
            }
            document.body.appendChild(script)   // add script to the body
        }
        // if there is no order or sucessPay is true or successDeliver is true
        if (!order || successPay || successDeliver) {
            // if no order - fetch the order details
            // if successPay is true, set isPaid to true.
            // if successDeliver is true, set isDelivered to true.
            dispatch({ type: ORDER_PAY_RESET })  // reset order
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) { // if order is not paid
            if (!window.paypal) {   // if paypal script is not loaded
                addPayPalScript()   // load it
            } else {
                setSdkReady(true)   // set sdkReady to true
            }
        }
    }, [dispatch, order, userInfo, orderId, successPay, successDeliver, history])

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }
    
    return (
        loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
            <>
                <h1>Order {order._id}</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p><strong>Name: </strong>{order.user.name}</p>
                                <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                                <p>
                                    <strong>Address:{' '}</strong>
                                    {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                                    {order.shippingAddress.postalCode}, {' '}
                                    {order.shippingAddress.country}
                                </p>
                                {order.isDelivered ? (
                                    <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                                ) : (
                                    <Message variant='danger'>Not Delivered</Message>
                                )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Payment method</h2>
                                <p>
                                    <strong>Method:{' '}</strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <Message variant='success'>Paid on {order.paidAt}</Message>
                                ) : (
                                    <Message variant='danger'>Not Paid</Message>
                                )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Order Items{' '}</h2>
                                {order.orderItems.length === 0 ? (
                                    <Message>Order is empty</Message>
                                ) : (
                                    <ListGroup variant='flush'>
                                        {order.orderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} x ${item.price} = ${item.qty * item.price}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>

                    <Col md={4}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {/* PayPal button - if order is not paid */}
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}
                                        {!sdkReady ? <Loader /> : (
                                            <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />
                                        )}
                                    </ListGroup.Item>
                                )}
                                {loadingDeliver && <Loader/>}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                            Mark as delivered
                                    </Button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </>
    )
}

export default OrderScreen
