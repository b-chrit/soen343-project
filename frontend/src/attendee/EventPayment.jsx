import React, {useState, useEffect } from 'react'
import { loadStripe } from "@stripe/stripe-js/pure";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from '../CheckoutForm';


export default function EventPayment( { event, clientSecret, isLoading, handleRegistration } ) {

  const [stripePromise, setStripePromise] = useState(null);

  const loadStripePromise = async () => {
    try {
      const response = await fetch(`http://localhost:5003/payment/get_key`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const stripe_public_key = await response.json();
      
      setStripePromise(loadStripe(stripe_public_key.stripe_public_key));
    } catch (error) {
      console.log(error);
    } 
  }

  const paymentComplete = () => {
    handleRegistration();
  }

  useEffect(() => {
    loadStripePromise();
  }, [])

  if (stripePromise == null){
    return;
  }

  return (
    <div className='w-full h-full flex flex-col'>
      <h2 className="text-3xl font-bold text-black">Payment</h2>

      <div className='flex flex-row my-10'>
        <div className='flex flex-col w-full'>
            <div className='flex flex-col h-full'>
              <p className='text-xs'><strong>Price</strong></p>
              <div className='w-full flex flex-row'>
                <p className='w-[70px]'>{event.feeFormatted}</p>
                <p>Registration fee</p>
              </div>
              <div className='w-full flex flex-row'>
                <p className='w-[70px]'>+ $ {(event.fee * 0.05).toFixed(2)}</p>
                <p>TPS</p>
              </div>
              <div className='w-full flex flex-row'>
                <p className='w-[70px]'>+ $ {(event.fee * 0.0975).toFixed(2)}</p>
                <p>TVQ</p>
              </div>

              <p className='mt-4 text-xs'><strong>Total</strong></p>
              <p>$ {(event.fee + event.fee * 0.05 + event.fee * 0.0975).toFixed(2)} CAD</p>

            </div>
          </div>
        <div className='flex flex-col w-full'>
          <div>
            <p className='text-xs'><strong>Event</strong></p>
            <p><i>{event.title}</i></p>
            <p className='text-xs mt-2'><strong>Location</strong></p>
            <p>{event.location}</p>
          </div>
        </div>
        
      </div>
      
      
      <Elements stripe={stripePromise} options={{clientSecret}}>
        <CheckoutForm paymentComplete={paymentComplete}/>
      </Elements>
    </div>
  )
}
