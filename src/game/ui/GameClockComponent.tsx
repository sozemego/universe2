import React from 'react';
import { useGetTime } from '../state/selectors';

export function GameClockComponent() {
  let time = useGetTime();
  time = Math.ceil(time);

  let date = new Date(0);
  date.setSeconds(time);
  let result = date.toISOString().substr(11, 8);

  return (
    <div>
      <div>{result}</div>
    </div>
  );
}
