export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/300";
  
  if (imagePath.startsWith("http://")) {
    imagePath = imagePath.replace("http://", "https://");
  }

  if (imagePath.startsWith("https://")) return imagePath; // Already an absolute URL
  
  const apiBase = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace("/api", "") 
    : "https://karigari-1.onrender.com";
    
  if (imagePath.startsWith("/uploads")) {
    return `${apiBase}${imagePath}`;
  }
  
  return imagePath;
};
