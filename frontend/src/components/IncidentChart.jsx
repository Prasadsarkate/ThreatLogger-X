import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", incidents: 2 },
  { day: "Tue", incidents: 4 },
  { day: "Wed", incidents: 1 },
  { day: "Thu", incidents: 5 },
  { day: "Fri", incidents: 3 },
];

const IncidentChart = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-white">
      <h2 className="text-lg font-semibold mb-4">Incident Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="incidents" stroke="#3b82f6" strokeWidth={3} />
          <CartesianGrid stroke="#555" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncidentChart;
