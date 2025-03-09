"use client";

import * as React from "react";

export const useMounted = () => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);

    return () => setIsMounted(false);
  }, []);

  return isMounted;
};
