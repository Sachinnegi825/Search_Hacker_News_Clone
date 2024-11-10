import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchHackerNewsData = async (
  query = "",
  page = 0,
  hitsPerPage = 10
) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: {
        query,
        page,
        hitsPerPage,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
  }
};
