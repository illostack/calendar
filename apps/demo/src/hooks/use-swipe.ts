import { useEffect, useState } from "react";

const useSwipe = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  tolerance = 50
) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientX);
      setTouchEnd(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      setTouchEnd(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;

      if (distance > tolerance) {
        onSwipeLeft?.();
      } else if (distance < -tolerance) {
        onSwipeRight?.();
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [touchStart, touchEnd, onSwipeLeft, onSwipeRight, tolerance]);
};

export default useSwipe;
