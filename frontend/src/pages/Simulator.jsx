import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Simulator() {
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      loadHistory(token);
    }
  }, [navigate]);

  const loadHistory = async (token) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/simulate/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("History fetch error:", err.message);
    }
  };

  const createDummyFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await fetch("http://127.0.0.1:8000/simulate/create-files", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setMessage(`✅ Created ${data.created} dummy files`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating dummy files");
    }
  };

  const runSimulation = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await fetch("http://127.0.0.1:8000/simulate/run", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Simulation failed: ${res.status}`);
      const data = await res.json();
      setResult(data);
      setMessage("✅ Simulation completed successfully!");
      loadHistory(token); // reload history after simulation
    } catch (err) {
      console.error(err);
      setMessage("❌ Error running simulation");
    }
  };

  // ✅ Status Color Function
  const getStatusColor = (status) => {
    if (!status) return "text-gray-300";
    const s = status.toLowerCase();
    if (s.includes("success") || s.includes("completed")) return "text-green-400 font-semibold";
    if (s.includes("fail") || s.includes("error")) return "text-red-400 font-semibold";
    if (s.includes("running") || s.includes("pending")) return "text-yellow-400 font-semibold";
    return "text-gray-300";
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
      <div className="max-w-5xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-indigo-400">
          🛠 Simulator
        </h2>
        <p className="text-gray-400 mb-8 text-center">
          Run ransomware-like attack simulations for SOC testing
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
          <button
            onClick={createDummyFiles}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl shadow hover:bg-indigo-700 transition-colors font-semibold"
          >
            📂 Create Dummy Files
          </button>
          <button
            onClick={runSimulation}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl shadow hover:bg-red-700 transition-colors font-semibold"
          >
            🚀 Run Simulation
          </button>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-center mb-6 font-semibold ${
              message.startsWith("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        {/* Simulation Result */}
        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="p-6 rounded-xl shadow-lg bg-indigo-700/80 backdrop-blur text-white">
              <h3 className="text-lg font-semibold">📊 Status</h3>
              <p className="text-2xl font-bold mt-2">{result.status}</p>
            </div>
            <div className="p-6 rounded-xl shadow-lg bg-green-700/80 backdrop-blur text-white">
              <h3 className="text-lg font-semibold">📑 Renamed Files</h3>
              <p className="text-2xl font-bold mt-2">{result.renamed}</p>
            </div>
            <div className="p-6 rounded-xl shadow-lg bg-purple-700/80 backdrop-blur text-white">
              <h3 className="text-lg font-semibold">📝 Ransom Note</h3>
              <p className="text-sm mt-2 break-words">{result.ransom_note}</p>
            </div>
          </div>
        )}

        {/* Simulation History */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-indigo-300 mb-4">
            📜 Simulation History
          </h3>
          {history.length === 0 ? (
            <p className="text-gray-400 text-center">
              No past simulations found.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-700 max-h-72">
              <table className="min-w-full bg-gray-800">
                <thead className="bg-gray-700 text-gray-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Renamed</th>
                    <th className="px-4 py-2 text-left">Ransom Note</th>
                    <th className="px-4 py-2 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-700 hover:bg-gray-600 transition"
                    >
                      <td className={`px-4 py-2 ${getStatusColor(h.status)}`}>
                        {h.status}
                      </td>
                      <td className="px-4 py-2 text-gray-200">{h.renamed}</td>
                      <td className="px-4 py-2 truncate max-w-xs text-gray-300">
                        {h.ransom_note}
                      </td>
                      <td className="px-4 py-2 text-gray-400">{h.timestamp || "-"}</td>
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
