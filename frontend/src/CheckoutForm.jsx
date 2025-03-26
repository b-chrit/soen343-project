import React, { useState } from 'react'
import {PaymentElement} from '@stripe/react-stripe-js';
import { useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm( {paymentComplete} ) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        if (!stripe || !elements) return;
        e.preventDefault();

        setIsProcessing(true);

        const {error, paymentIntent} = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
        });

        if (error) {
            setMessage(error.message);
        }else if(paymentIntent && paymentIntent.status === 'succeeded'){
            console.log('pcpc');
            paymentComplete();
        }

        setIsProcessing(false);
    }


  return (
    <form className='flex w-full h-full flex-col justify-between' onSubmit={handleSubmit}>
        <PaymentElement/>
        {message && (<p>{message}</p>)}
        <button className='py-3 px-8 font-medium rounded-lg border transition-all duration-300 bg-black text-white border-black hover:bg-white hover:text-black' id='submit' disabled={isProcessing}>
            <span>
                {isProcessing ? "Processing ..." : "Pay Now"}
            </span>
        </button>


    </form>
  )
}

export default CheckoutForm