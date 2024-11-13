import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchHackerNewsData } from "../services/api";
import { addSearchHistory } from "../store/searchHistorySlice";

const Home = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState("search");
  const [dateRange, setDateRange] = useState(12345);
  const [tags, setTags] = useState("story");
  const user = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hitsPerPage = 10;
  const [page, setPage] = useState(1);
  const [currentPageGroup, setCurrentPageGroup] = useState([1, 2, 3, 4, 5]);

  const totalPages = 50;

  const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);
  const getPastTimestamp = (days) =>
    getCurrentTimestamp() - days * 24 * 60 * 60;

  const updateURLParams = () => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (page) params.set("page", page - 1);
    if (sortOption) params.set("sortOption", sortOption);
    if (dateRange) params.set("dateRange", dateRange);
    if (tags) params.set("tags", tags);

    navigate(`?${params.toString()}`, { replace: true });
  };

  const fetchData = async () => {
    try {
      const response = await fetchHackerNewsData(
        query,
        page - 1,
        hitsPerPage,
        tags,
        sortOption,
        getPastTimestamp(dateRange)
      );
      setData(response?.hits || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [query, page, tags, sortOption, dateRange]);

  useEffect(() => {
    updateURLParams();
  }, [query, page, sortOption, dateRange, tags]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

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

  const handleNextPage = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);

      // Shift currentPageGroup if the newPage is beyond the visible range
      if (newPage > currentPageGroup[currentPageGroup.length - 1]) {
        setCurrentPageGroup((prev) => prev.map((p) => p + 1));
      }
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);

      // Shift currentPageGroup if the newPage is below the visible range
      if (newPage < currentPageGroup[0]) {
        setCurrentPageGroup((prev) => prev.map((p) => p - 1));
      }
    }
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };
  return (
    <div className="max-w-full md:max-w-screen-xl m-auto">
      <header className="bg-orange-500 text-white p-4">
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
            className="mt-2 p-2 rounded w-4/5 text-black"
          />
          <p className="w-1/5 ml-5">
            {user ? `Welcome, ${user?.toUpperCase()}` : null}
          </p>
          {user && (
            <button className="bg-blue-950 p-2 text-white rounded-lg cursor-pointer">
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
            <option value={349}>All Time</option>
            <option value={1}>Last 24 Hours</option>
            <option value={7}>Last Week</option>
            <option value={30}>Last Month</option>
            <option value={365}>Last Year</option>
          </select>
        </div>

        <div className="flex mb-4 mx-5 items-center">
          <label className="mr-2">By:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border"
          >
            <option value="search">Popularity</option>
            <option value="search_by_date">Date</option>
          </select>
        </div>

        <div className="flex mb-4 mx-5 items-center">
          <label className="mr-2">Search:</label>
          <select
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="p-2 border"
          >
            <option value="all">All</option>
            <option value="story">Stories</option>
            <option value="comment">Comments</option>
            <option value="poll">Polls</option>
            <option value="job">Jobs</option>
            <option
              value="show_hn
"
            >
              Show HN
            </option>
            <option value="ask_hn">Ask HN</option>
          </select>
        </div>
      </div>

      <div>
        {data.map((item) => (
          <div
            key={item.objectID}
            onClick={() => {
              window.open(item.url, "_blank");
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
      <div className="flex justify-center gap-4 my-6">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="p-2 border-2 rounded-md"
        >
          Previous
        </button>

        {currentPageGroup.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageClick(pageNum)}
            className={`px-4 border-2 rounded-md ${
              page === pageNum ? "bg-blue-500 text-white" : ""
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="p-2 border-2 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
