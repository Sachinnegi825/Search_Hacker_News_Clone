import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchHackerNewsData } from "../services/api";
import { addSearchHistory } from "../store/searchHistorySlice";
import dayjs from "dayjs";

const Home = () => {
  const [query, setQuery] = useState("");
  const [baseData, setBaseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [sortOption, setSortOption] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [tags, setTags] = useState("");
  const user = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hitsPerPage = 10;

  // Function to update URL parameters
  const updateURLParams = () => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (page) params.set("page", page);
    if (sortOption) params.set("sortOption", sortOption);
    if (dateRange) params.set("dateRange", dateRange);
    if (tags) params.set("tags", tags);

    navigate(`?${params.toString()}`, { replace: true });
  };

  const fetchData = async () => {
    try {
      const response = await fetchHackerNewsData(query, page, hitsPerPage);
      setBaseData(response?.hits || []);
      setFilteredData(response?.hits || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query, page]);

  useEffect(() => {
    updateURLParams();
  }, [query, page, sortOption, dateRange, tags]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const applyFilters = () => {
    let filtered = baseData;
    const now = dayjs();

    if (query) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (dateRange === "last24h") {
      filtered = filtered.filter((item) =>
        dayjs(item.created_at).isAfter(now.subtract(1, "day"))
      );
    } else if (dateRange === "lastWeek") {
      filtered = filtered.filter((item) =>
        dayjs(item.created_at).isAfter(now.subtract(7, "day"))
      );
    } else if (dateRange === "lastMonth") {
      filtered = filtered.filter((item) =>
        dayjs(item.created_at).isAfter(now.subtract(1, "month"))
      );
    } else if (dateRange === "lastYear") {
      filtered = filtered.filter((item) =>
        dayjs(item.created_at).isAfter(now.subtract(1, "year"))
      );
    }

    if (sortOption === "byDate") {
      filtered = filtered
        .slice()
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortOption === "byPopularity") {
      filtered = filtered.slice().sort((a, b) => b.points - a.points);
    }

    if (tags) {
      filtered = filtered.filter(
        (item) => item._tags && item._tags.includes(tags)
      );
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [baseData, dateRange, sortOption, tags]);

  const highlightText = (title) => {
    if (!query) return title;
    const parts = title?.split(new RegExp(`(${query})`, "gi"));
    return parts?.map((part, index) =>
      part?.toLowerCase() === query?.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-full md:max-w-screen-xl m-auto">
      <header className="bg-orange-500 text-white p-4 ">
        <div className="flex justify-between items-center">
          <p className="w-1/5 text-3xl text-black font-semibold">
            Search <br />
            Hacker News
          </p>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleSearch}
            className="mt-2 p-2 rounded w-4/5"
          />
          <p className="w-1/5 ml-5">
            {user ? `Welcome, ${user?.toUpperCase()}` : null}{" "}
          </p>
          {user && (
            <button className="bg-blue-950 p-2 text-white rounded-lg cursor-pointer">
              {" "}
              <Link to={"/history"}>History</Link>
            </button>
          )}
        </div>
      </header>

      <div className="p-4 flex">
        <div className="flex mb-4 mx-5 items-center">
          <label className="mr-2">for:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="p-2 border"
          >
            <option value="all">All Time</option>
            <option value="last24h">Last 24 Hours</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="lastYear">Last Year</option>
          </select>
        </div>

        <div className="flex mb-4 mx-5 items-center">
          <label className="mr-2">By:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border"
          >
            <option value="byPopularity">Popularity</option>
            <option value="byDate">Date</option>
          </select>
        </div>

        <div className="flex mb-4 mx-5 items-center">
          <label className="mr-2">Search:</label>
          <select
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="p-2 border"
          >
            <option value="story">Stories</option>
            <option value="comment">Comments</option>
          </select>
        </div>
      </div>

      <div>
        {filteredData.map((item) => (
          <div
            key={item.objectID}
            onClick={() => {
              window.open(item.url, "_blank"),
                dispatch(
                  addSearchHistory({
                    url: item?.url,
                    title: item?.title,
                    time: new Date(),
                  })
                );
            }}
            className="cursor-pointer"
          >
            <div className="border p-2">
              <strong> {highlightText(item.title)} </strong>({item.url})<br />
              <p>
                {item?.points} points | {item?.author} | {item?.num_comments}{" "}
                comments | {item?.created_at.slice(0, 10)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={filteredData.length === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
