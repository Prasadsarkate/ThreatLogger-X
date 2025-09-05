import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateReport, fetchIncidents } from "../services/api";

export default function Reports() {
  const [incidentId, setIncidentId] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [incidents, setIncidents] = useState([]);
  const navigate = useNavigate();

  // ✅ Login check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirect to login if not logged in
    } else {
      loadIncidents(token);
    }
  }, [navigate]);

  const loadIncidents = async (token) => {
    try {
      const data = await fetchIncidents(token);
      setIncidents(data);
    } catch (err) {
      console.error("Error fetching incidents:", err.message);
    }
  };

  const handleGenerate = async () => {
    try {
      const token = localStorage.getItem("token"); // actual login token
      if (!token) {
        navigate("/login");
        return;
      }

      const data = await generateReport(incidentId, token);
      setReport(data);
      setError("");
    } catch (err) {
      setError("Error while generating report: " + err.message);
    }
  };

  // ✅ Severity color function
  const getSeverityClass = (severity) => {
    if (severity === "High") return "text-red-400 font-semibold";
    if (severity === "Medium") return "text-yellow-400 font-semibold";
    if (severity === "Low") return "text-green-400 font-semibold";
    return "text-gray-300";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-900 p-6 text-gray-100">
      <div className="bg-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-400">
          📑 Generate Report
        </h2>

        {/* Input + Button */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter Incident ID"
            value={incidentId}
            onChange={(e) => setIncidentId(e.target.value)}
            className="flex-1 border border-gray-600 px-4 py-2 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleGenerate}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
          >
            Generate
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-center mb-4 font-medium">{error}</p>
        )}

        {/* Report Output */}
        {report && (
          <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-xl shadow-md max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-2 text-indigo-300">
              Report Result:
            </h3>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-snug">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        )}

        {/* Old Incidents */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-indigo-300 mb-4">
            📜 Previous Incidents
          </h3>
          {incidents.length === 0 ? (
            <p className="text-gray-400 text-center">No old incidents found.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-700 max-h-64">
              <table className="min-w-full bg-gray-800">
                <thead className="bg-gray-700 text-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Severity</th>
                    <th className="px-4 py-2 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((inc) => (
                    <tr
                      key={inc.id}
                      className="border-b border-gray-700 hover:bg-gray-600"
                    >
                      <td className="px-4 py-2">{inc.type}</td>
                      <td className={`px-4 py-2 ${getSeverityClass(inc.severity)}`}>
                        {inc.severity}
                      </td>
                      <td className="px-4 py-2">{inc.timestamp || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
