export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/300";
  if (imagePath.startsWith("http")) return imagePath; // Already an absolute URL
  
  const apiBase = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace("/api", "") 
    : "http://localhost:5000";
    
  if (imagePath.startsWith("/uploads")) {
    return `${apiBase}${imagePath}`;
  }
  
  return imagePath;
};
