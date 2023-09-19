const formatDateTimeToGMT1 = (dateTimeString) => {
  const dateTime = new Date(dateTimeString);

  const dateTimeGMT1 = new Date(dateTime);

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // timeZoneName: 'short',
  };

  const formattedDateTime = new Intl.DateTimeFormat('en-US', options).format(
    dateTimeGMT1
  );

  return formattedDateTime;
};

export default formatDateTimeToGMT1;
