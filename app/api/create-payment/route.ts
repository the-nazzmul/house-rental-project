
import { NextRequest, NextResponse } from "next/server";

import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY || ""


const stripe = new Stripe(key);


export async function POST(req: NextRequest) {
    const body: any = await req.json();
    const advancePayment = (body?.totalPrice * 15) / 100
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: advancePayment * 100,
            currency: 'usd',
            description: 'Payment intent',
            automatic_payment_methods: {
                enabled: true
            }
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret })
    } catch (err: any) {
        console.log({ err })
        return NextResponse.json(err.message)
    }

}