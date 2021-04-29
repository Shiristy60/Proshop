import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

// steps monitor the the stages till the user has completed the order procedure
const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <Nav className='justify-content-center mb-4'>
            <Nav.Item>
                {step1 ? ( // do the sign in, if not done yet
                    <LinkContainer to='/login'>
                        <Nav.Link>Sign In</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Sign In</Nav.Link>  // if earlier steps have not been completed, disable this link.
                )}
            </Nav.Item>
            
            <Nav.Item>
                {step2 ? ( // signed in, add the shipping address
                    <LinkContainer to='/shipping'>
                        <Nav.Link>Shipping</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Shipping</Nav.Link>  // if earlier steps have not been completed, disable this link.
                )}
            </Nav.Item>
            
            <Nav.Item>
                {step3 ? (  // after shipping address, complete the payment
                    <LinkContainer to='/payment'>
                        <Nav.Link>Payment</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Payment</Nav.Link> // if earlier steps have not been completed, disable this link.
                )}
            </Nav.Item>
            
            <Nav.Item>
                {step4 ? (  // after adding the address, place the order
                    <LinkContainer to='/placeorder'>
                        <Nav.Link>Place Order</Nav.Link>
                    </LinkContainer>
                ) : (
                    <Nav.Link disabled>Place Order</Nav.Link>  // if earlier steps have not been completed, disable this link.
                )}
            </Nav.Item> 
        </Nav>
    )
}

export default CheckoutSteps
