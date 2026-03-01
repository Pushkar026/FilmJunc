export const getImageUrl = (
  url?: string,
  fallback: string = "/images/10337609.png"
) => {
  if (!url) return fallback;

  if (url.startsWith("http")) {
    return url;
  }

  return `${import.meta.env.VITE_API_BASE_URL}${url}`;
};