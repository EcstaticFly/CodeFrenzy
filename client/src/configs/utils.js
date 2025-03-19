export function convertToIST(utcTime) {
  const date = new Date(utcTime);

  const istDate = new Date(date.getTime());

  // Format the date and time
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };
  return istDate.toLocaleString("en-IN", options);
}
