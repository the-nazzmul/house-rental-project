import getCurrentUser from "@/actions/getCurrentUser";
import EmptyState from "@/components/EmptyState";
import PropertiesClient from "./PropertiesClient";
import getListings from "@/actions/getListings";
import { Suspense } from "react";

function SuspenseBoundary() {
  return <>Loading</>;
}

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  const listings = await getListings({ userId: currentUser.id });

  if (listings.length === 0) {
    return (
      <EmptyState
        title="No properties found"
        subtitle="Looks like you have no property!"
      />
    );
  }

  return (
    <Suspense fallback={<SuspenseBoundary />}>
      <PropertiesClient listings={listings} currentUser={currentUser} />
    </Suspense>
  );
};

export default PropertiesPage;
