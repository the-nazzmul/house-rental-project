"use client";

import EmptyState from "@/components/EmptyState";
import { useEffect } from "react";

interface IErrorStateProps {
  error: Error;
}

const ErrorState: React.FC<IErrorStateProps> = ({ error }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <EmptyState title="OOPS..." subtitle="Something went wrong!!" />;
};

export default ErrorState;
