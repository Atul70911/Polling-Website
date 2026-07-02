export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const h = Math.floor((Date.now() - new Date(dateStr)) / 3_600_000);
  if (h < 1)  return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}