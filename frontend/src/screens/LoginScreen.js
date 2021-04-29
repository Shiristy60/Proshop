import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message.js'
import Loader from '../components/Loader.js'
import FormContainer from '../components/FormContainer.js'
import { login } from '../actions/userActions.js'

const LoginScreen = ({location, history}) => {

    // component level state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { loading, error, userInfo } = userLogin

    // if url query exists, split it on the basis of '='
    const redirect = location.search ? location.search.split('=')[1] : '/'

    // if already logged in( userInfo already exists), go to the homescreen
    useEffect(() => {
        if (userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {/* if there is an error */}
            {error && <Message variant='danger'>{error}</Message>}
            {/* if loading is true */}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter email' value={email} onChange = {(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password </Form.Label>
                    <Form.Control type='password' placeholder='Enter password' value={password} onChange = {(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>

                <Button type='submit' variant = 'primary'>Sign In</Button>
            </Form>

            <Row className='py-3'>
                <Col>
                    { /* if there's a redirect value, go back to the redirect value, else go to register route*/}
                    New customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                         Register
                    </Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
