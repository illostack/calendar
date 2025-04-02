"use client";

import * as React from "react";

const useCurrentDate = () => {
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  return currentDate;
};

export { useCurrentDate };
