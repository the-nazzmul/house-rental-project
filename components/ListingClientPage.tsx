"use client";

import { Listing, Reservation, User } from "@prisma/client";
import { useMemo } from "react";
import { categories } from "./navbar/Categories";
import Container from "./Container";
import ListingHead from "./listings/ListingHead";
import ListingInfo from "./listings/ListingInfo";

interface IListingClientPageProps {
  reservation?: Reservation[];
  listing: Listing & { user: User };
  currentUser?: User | null;
}

const ListingClientPage: React.FC<IListingClientPageProps> = ({
  reservation,
  listing,
  currentUser,
}) => {
  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [listing.category]);
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
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClientPage;
