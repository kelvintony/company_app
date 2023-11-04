import { useState, useEffect } from 'react';

function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateCurrentTime = () => {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      };

      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const formattedDateTime = new Date().toLocaleString(undefined, {
        timeZone: userTimeZone,
        ...options,
      });
      setCurrentTime(formattedDateTime);
    };

    // Update the time initially and then every second
    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <p>{currentTime}</p>;
}

export default TimeDisplay;
