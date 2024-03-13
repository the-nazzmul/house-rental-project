import { useEffect, useState } from "react";

import { CardElement, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const CheckoutForm = ({ data }: any) => {

  const advancePaid = (data?.totalPrice * 15) / 100
  const due = data?.totalPrice - advancePaid
  const router = useRouter()
  const stripe: any = useStripe();
  const elements = useElements();


  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }
  }, []);
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const { error, paymentMethod } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`
      },
      redirect: 'if_required'
    });


    if (error) {
      toast.error(error.message);
      return;
    } else {

      await axios
        .post("/api/reservations", { ...data, due, advancePaid })
        .then((res) => {
          toast.success("Payment received & Listing reserved");
          router.push("/trips");
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong"))
        .finally(() => {
          setIsLoading(false);
        });
    }

  };

  return (
    <form onSubmit={handleSubmit} className="border w-full mt-4 p-5 rounded-lg ">
      <div>
        <h1>Pay Advance <b>15%</b> of total </h1>
        <div className="flex justify-between  text-xl font-semibold">
          <span>Advance amount:</span>  <span>$ {advancePaid}</span>
        </div>
      </div>
      <div className="text-white my-5">
        <PaymentElement />
      </div>
      <button type="submit" disabled={!stripe || !elements} className="px-5 py-3 rounded text-white bg-rose-500 w-full">
        Pay Advance
      </button>
    </form>
  );
};

export default CheckoutForm;
