const apiBaseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");

if (!apiBaseUrl) {
  throw new Error("VITE_BACKEND_URL is not configured.");
}

export default apiBaseUrl;
