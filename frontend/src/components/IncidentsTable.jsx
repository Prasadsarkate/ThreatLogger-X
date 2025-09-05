const incidents = [
  { id: "INC001", type: "Malware", severity: "High", date: "2025-09-01", status: "Active" },
  { id: "INC002", type: "Phishing", severity: "Medium", date: "2025-09-01", status: "Resolved" },
  { id: "INC003", type: "DDoS", severity: "Critical", date: "2025-08-31", status: "Active" },
];

const severityColors = {
  Low: "bg-green-600",
  Medium: "bg-yellow-500",
  High: "bg-orange-500",
  Critical: "bg-red-600",
};

const IncidentsTable = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-white mt-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Incident List</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-2 border-b border-gray-700">ID</th>
            <th className="p-2 border-b border-gray-700">Type</th>
            <th className="p-2 border-b border-gray-700">Severity</th>
            <th className="p-2 border-b border-gray-700">Date</th>
            <th className="p-2 border-b border-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc) => (
            <tr key={inc.id} className="hover:bg-gray-700">
              <td className="p-2">{inc.id}</td>
              <td className="p-2">{inc.type}</td>
              <td className="p-2">
                <span className={`px-3 py-1 rounded-lg text-sm ${severityColors[inc.severity]}`}>
                  {inc.severity}
                </span>
              </td>
              <td className="p-2">{inc.date}</td>
              <td className="p-2">{inc.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentsTable;
