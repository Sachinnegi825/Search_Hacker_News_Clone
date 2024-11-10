import { useSelector, useDispatch } from "react-redux";
import { clearSearchHistory } from "../store/searchHistorySlice";
import { useEffect } from "react";

const SearchHistoryPage = () => {
  const dispatch = useDispatch();
  const searchHistory = useSelector((state) => state.searchHistory);

  useEffect(() => {
    console.log("cfds", searchHistory);
  }, []);
  const user = useSelector((state) => state.user.username);

  const handleClearHistory = () => {
    dispatch(clearSearchHistory());
  };

  if (!user) {
    return <p>Please log in to view your search history.</p>;
  }

  return (
    <div className="max-w-full md:max-w-screen-xl m-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center underline">
        Search History
      </h2>

      {searchHistory?.length === 0 ? (
        <p>No search history available.</p>
      ) : (
        <div>
          <ul className="flex justify-center flex-col gap-3 pl-5">
            {searchHistory?.map((entry, index) => (
              <li key={index} className="my-2">
                <p>
                  <strong>{index + 1}:</strong> {entry?.data?.title} (
                  {entry?.data?.url}) <br />(
                  {new Date(entry?.data?.time).toISOString().slice(0, 10)})
                </p>
              </li>
            ))}
          </ul>
          <button
            onClick={handleClearHistory}
            className="mt-4 p-2 bg-red-500 text-white rounded"
          >
            Clear Search History
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchHistoryPage;
