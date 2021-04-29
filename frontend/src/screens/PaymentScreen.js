import React, { useState} from 'react'
import { Form, Button, Col} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../actions/cartActions.js'
import CheckoutSteps from '../components/CheckoutSteps.js'
import FormContainer from '../components/FormContainer.js'

// screen to choose the payment method
// add other payment methods, later
const PaymentScreen = ({ history }) => {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    // if there is no shipping address
    if (!shippingAddress) {
        history.push('/shipping')
    }
    
    const dispatch = useDispatch();

    const [paymentMethod, setPaymentMethod] = useState('Paypal')    // default payment method is PayPal
    
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
    }

    return (
        <FormContainer>
            <h1>Payment Method</h1>
            {/* step1 and step2 are complete*/}
            <CheckoutSteps step1 step2 step3/>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as = 'legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type='radio'
                            label='PayPal or Credit Card'
                            id='PayPal'
                            name='paymentMethod'
                            value='PayPal'
                            checked
                            onChange={(e) =>
                                setPaymentMethod(e.target.value)}
                        ></Form.Check>
                    </Col>
                </Form.Group>
                <Button
                    type='submit'
                    variant='primary'
                >
                    CONTINUE
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen
