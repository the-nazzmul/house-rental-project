"use client";

import { Listing, Reservation, User } from "@prisma/client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { categories } from "../../../components/navbar/Categories";
import Container from "../../../components/Container";
import ListingHead from "../../../components/listings/ListingHead";
import ListingInfo from "../../../components/listings/ListingInfo";
import useLoginModal from "@/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import ListingReservation from "@/components/listings/ListingReservation";
import { Range } from "react-date-range";
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { is } from "date-fns/locale";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface IListingClientPageProps {
  reservations?: Reservation[];
  listing: Listing & { user: User };
  currentUser?: User | null;
}

const ListingClientPage: React.FC<IListingClientPageProps> = ({
  reservations = [],
  listing,
  currentUser,
}) => {
  const [clientSecret, setClientSecret] = useState<string>()
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });
      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const data = {
    totalPrice,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    listingId: listing?.id,
  }
  // Function for creating reservations
  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    setIsLoading(true);

    axios
      .post("/api/create-payment", data)
      .then((res) => {
        setClientSecret(res.data.clientSecret)
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => {
        setIsLoading(false);
      });
  }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);

  // calculating total price
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, listing.price]);

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);


  const options: StripeElementsOptions = {
    clientSecret: String(clientSecret),
    appearance: {
      theme: 'stripe'
    }
  }
  const stripePromise = loadStripe("pk_test_51MoRzYA8qrQp1zwvisz9mSIs8NITcwnX96PWjqIfc7PAN89bKfvC8ww3nopY2oKrgmbSoJSN5K5OkKWweFBLwXeZ00n7w8APUQ")

  useEffect(() => {
    if (clientSecret) {
      setIsLoading(true)
    }
  }, [clientSecret])
  return (
    <Container>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              bathroomCount={listing.bathroomCount}
              guestCount={listing.guestCount}
              locationValue={listing.locationValue}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />

              {clientSecret && stripePromise &&
                <Elements options={options} stripe={stripePromise}>
                  <CheckoutForm data={data} />
                </Elements>
              }
            </div>
          </div>
        </div>

      </div>
    </Container>
  );
};

export default ListingClientPage;
