export const extractImageUrl = (url = "") => {
  try {
    // If it's a Google imgres URL, extract the imgurl param
    if (url.includes("google.com/imgres")) {
      const params = new URL(url).searchParams;
      const imgurl = params.get("imgurl");
      if (imgurl) return decodeURIComponent(imgurl);
    }
    return url; // already a direct URL
  } catch {
    return url;
  }
};