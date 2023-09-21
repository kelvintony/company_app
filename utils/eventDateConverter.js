const eventDateConverter = (dateTimeString) => {
  const inputDate = dateTimeString;
  const formattedDate = formatDate(inputDate);

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = getMonthName(date.getMonth());
    const year = date.getFullYear();
    const dayWithSuffix = getDayWithSuffix(day);

    return `${dayWithSuffix} ${month}, ${year}`;
  }

  function getMonthName(monthIndex) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[monthIndex];
  }

  function getDayWithSuffix(day) {
    if (day >= 11 && day <= 13) {
      return `${day}th`;
    }
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  }

  return formattedDate; // Output: "6th September 2023"
};

export default eventDateConverter;
