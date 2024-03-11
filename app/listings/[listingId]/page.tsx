import getCurrentUser from "@/actions/getCurrentUser";
import getListingById from "@/actions/getListingById";
import EmptyState from "@/components/EmptyState";
import ListingClientPage from "@/app/listings/[listingId]/ListingClientPage";
import getReservations from "@/actions/getReservation";

interface IParams {
  listingId?: string;
}

const ListingPage = async ({ params }: { params: IParams }) => {
  const listing = await getListingById(params);
  const currentUser = await getCurrentUser();
  const reservations = await getReservations(params);

  if (!listing) {
    return <EmptyState />;
  }

  return (
    <>
      <ListingClientPage
        listing={listing}
        currentUser={currentUser}
        reservations={reservations}
      />
    </>
  );
};

export default ListingPage;
