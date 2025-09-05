"use client";

import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  delay?: number;
};

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  delay = 300,
}) => {
  const [displayedValue, setDisplayedValue] = useState(
    value <= 5 ? value : value - 5 + 1,
  );

  useEffect(() => {
    if (value <= 5) {
      setDisplayedValue(value);
      return;
    }

    let current = value - 5 + 1;
    const interval = setInterval(() => {
      if (current < value) {
        current++;
        setDisplayedValue(current);
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [value, delay]);

  return <span>{displayedValue}</span>;
};

export default AnimatedNumber;
