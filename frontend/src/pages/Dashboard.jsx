import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { fetchIncidents } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchIncidents();
        setIncidents(data);
      } catch (err) {
        setError(err.message);
        navigate("/login");
      }
    };
    loadData();
  }, [navigate]);

  // === existing logic ===
  const typeCount = incidents.reduce((acc, i) => {
    acc[i.type] = (acc[i.type] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeCount).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#6366F1", "#10B981", "#FBBF24", "#EF4444", "#3B82F6"];

  // === KPI calculations ===
  const totalIncidents = incidents.length;
  const uniqueTypes = pieData.length;
  const topType =
    pieData.length > 0
      ? pieData.reduce(
          (max, item) => (item.value > max.value ? item : max),
          pieData[0]
        ).name
      : "N/A";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wide">
        📊 Dashboard Overview
      </h2>

      {error && <p className="text-red-400 text-center mb-4">{error}</p>}
      {incidents.length === 0 && (
        <p className="text-gray-400 text-center mb-4">No incidents found.</p>
      )}

      {/* === KPI Cards === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold text-gray-300">Total Incidents</h3>
          <p className="text-3xl font-bold text-indigo-400 mt-2">{totalIncidents}</p>
        </div>
        <div className="bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold text-gray-300">Unique Types</h3>
          <p className="text-3xl font-bold text-green-400 mt-2">{uniqueTypes}</p>
        </div>
        <div className="bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 text-center hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold text-gray-300">Top Type</h3>
          <p className="text-2xl font-bold text-yellow-400 mt-2">{topType}</p>
        </div>
      </div>

      {/* === Charts Section === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 h-96">
          <h3 className="text-lg font-semibold mb-4 text-center">Incident Distribution</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none", color: "#fff" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 h-96">
          <h3 className="text-lg font-semibold mb-4 text-center">Incident Frequency</h3>
          <ResponsiveContainer>
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#D1D5DB" tick={{ fontSize: 12 }} interval={0} />
              <YAxis stroke="#D1D5DB" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none", color: "#fff" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <Bar dataKey="value" fill="url(#colorValue)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div className="bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 h-96">
          <h3 className="text-lg font-semibold mb-4 text-center">Type Trend (Area)</h3>
          <ResponsiveContainer>
            <AreaChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#D1D5DB" tick={{ fontSize: 12 }} interval={0} />
              <YAxis stroke="#D1D5DB" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none", color: "#fff" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366F1"
                fill="url(#colorArea)"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 h-96">
          <h3 className="text-lg font-semibold mb-4 text-center">Incident Line Trend</h3>
          <ResponsiveContainer>
            <LineChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#D1D5DB" tick={{ fontSize: 12 }} interval={0} />
              <YAxis stroke="#D1D5DB" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none", color: "#fff" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#FBBF24"
                strokeWidth={2.5}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="bg-gray-800/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 h-96">
          <h3 className="text-lg font-semibold mb-4 text-center">Incident Radar View</h3>
          <ResponsiveContainer>
            <RadarChart data={pieData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis
                dataKey="name"
                stroke="#D1D5DB"
                tick={{ fontSize: 12 }}
              />
              <PolarRadiusAxis stroke="#D1D5DB" tick={{ fontSize: 12 }} />
              <Radar
                name="Incidents"
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.6}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none", color: "#fff" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
