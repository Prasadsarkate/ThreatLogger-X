import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchIncidents } from "../services/api";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchIncidents();
        setIncidents(data);
      } catch (err) {
        setError(err.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.type.toLowerCase().includes(search.toLowerCase()) ||
      inc.severity.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity =
      severityFilter === "All" || inc.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentIncidents = filteredIncidents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading)
    return (
      <p className="text-gray-300 text-center mt-6 animate-pulse text-lg">
        Loading incidents...
      </p>
    );
  if (error)
    return <p className="text-red-400 text-center mt-6 text-lg">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <h2 className="text-3xl font-extrabold mb-6 text-center tracking-wide">
        🚨 Incidents
      </h2>

      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by type or severity..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/2 px-4 py-3 rounded-xl bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg text-base"
        />

        <select
          value={severityFilter}
          onChange={(e) => {
            setSeverityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-3 rounded-xl bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg text-base"
        >
          <option value="All">All Severities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {currentIncidents.length === 0 ? (
        <p className="text-gray-400 text-center mt-4 text-lg">
          No incidents found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-xl border border-gray-700 max-h-[600px]">
          <table className="min-w-full bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
            <thead className="bg-gray-700 text-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-lg">
                  Type
                </th>
                <th className="px-6 py-4 text-left font-semibold text-lg">
                  Severity
                </th>
                <th className="px-6 py-4 text-left font-semibold text-lg">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left font-semibold text-lg">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {currentIncidents.map((inc, idx) => (
                <tr
                  key={inc.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                  } hover:bg-gray-600 transition-colors`}
                >
                  <td className="px-6 py-4 text-base font-medium text-gray-100">
                    {inc.type}
                  </td>
                  <td
                    className={`px-6 py-4 text-base font-semibold ${
                      inc.severity === "High"
                        ? "text-red-400"
                        : inc.severity === "Medium"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {inc.severity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {inc.timestamp || "-"}
                  </td>
                  <td className="px-6 py-4 max-w-sm overflow-x-auto">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {JSON.stringify(inc.details, null, 2)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-5 py-2.5 rounded-lg font-medium ${
              currentPage === 1
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            ⬅ Prev
          </button>

          <span className="text-lg font-semibold text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-5 py-2.5 rounded-lg font-medium ${
              currentPage === totalPages
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}
