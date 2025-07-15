export default function convertIso(isoString) {
  const dateTime = new Date(isoString).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return dateTime;
}
