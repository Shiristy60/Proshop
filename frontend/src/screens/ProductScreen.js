import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import { listProductDetails } from '../actions/productActions.js'
import Message from '../components/Message.js';
import Loader from '../components/Loader.js';

const ProductScreen = ({ history, match }) => {
    // qty shows the number of items in stock.
    // qty is a component level state, therfore we use useState.
    const [qty, setQty] = useState(1)   // 1 by default

    const dispatch = useDispatch()

    const productDetails = useSelector(state=> state.productDetails)
    const { loading, error, product } = productDetails

    useEffect(() => {
        dispatch(listProductDetails(match.params.id))
    }, [dispatch, match])

    const addToCartHandler = () => {
        // React Router makes this easy by passing a history object into each route as a prop. 
        //This history object lets us manually control history of the browser.
        //To cause the change we want to happen, we need to push a new route onto the browser's history. 
        //React Router will pick this up and update the view accordingly.
        history.push(`/cart/${match.params.id}?qty=${qty}`)
        // this will redirect to/card/:id
    }
    return (
        <>
            <Link className="btn btn-light my-3 " to='/'>Go Back</Link>
            { loading ?
                    (<Loader />)
                : error ?
                    (<Message variant='danger'>{error} </Message>)
                :
                (
                    <Row>
                        <Col md={6}>
                            <Image fluid src={product.image} alt={ product.name }/>
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{ product.name }</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating} text={ `${product.numReviews} reviews`}/>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Price: ${ product.price }
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Description: ${ product.description }
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col>
                                                <strong>{ product.price}</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status: </Col>
                                            <Col>
                                                { product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                    
                                        {/* display only if item is in stock */}
                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col>
                                                    <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                                        {
                                                             // if countInStock has a value 5, it gives an array like [0, 1, 2, 3, 4]   
                                                            [...Array(product.countInStock).keys()].map(x => (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            ))
                                                        }
                                                    </Form.Control>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}    

                                    <ListGroup.Item>
                                            <Button onClick={ addToCartHandler} variant = 'warning' className='btn-block' type='button' disabled={product.countInStock === 0}>
                                            Add To Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                )
            }
        </>
    )
}

export default ProductScreen
