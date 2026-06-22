const formatToMySQLDatetime = (dateObj, time24) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(dateObj.getDate()).padStart(2, '0');

  const timeWithSeconds = time24.length === 5 ? `${time24}:00` : time24;

  return `${year}-${month}-${day} ${timeWithSeconds}`; // YYYY-MM-DD HH:MM:SS
};

export default formatToMySQLDatetime