import React from 'react';

export function useRealClock({ interval }: UseRealClockProps): UseRealClock {
  const [time, setTime] = React.useState(Date.now());

  React.useEffect(() => {
    let intervalId = setInterval(() => {
      setTime(time + interval);
    }, interval);
    return () => clearInterval(intervalId);
  }, [time, interval]);

  return { time: Date.now() };
}

export interface UseRealClockProps {
  interval: number;
}

export interface UseRealClock {
  time: number;
}
