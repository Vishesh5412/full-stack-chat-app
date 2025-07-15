export default function convertIso(isoString) {
  const dateTime = new Date(isoString).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return dateTime;
}
