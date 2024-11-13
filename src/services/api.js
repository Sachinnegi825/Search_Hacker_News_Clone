import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchHackerNewsData = async (
  query = "",
  page = 0,
  hitsPerPage = 10,
  tags = "story",
  sortOption = "search",
  dateRange
) => {
  try {
    const numericFilters = `created_at_i>${dateRange}`;

    const response = await axios.get(`${API_URL}/${sortOption}`, {
      params: {
        query,
        page,
        hitsPerPage,
        tags,
        numericFilters,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
  }
};
