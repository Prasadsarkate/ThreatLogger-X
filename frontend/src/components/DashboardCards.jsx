const DashboardCards = () => {
  const stats = [
    { title: "Active Incidents", value: 5, color: "bg-red-600" },
    { title: "Resolved Incidents", value: 12, color: "bg-green-600" },
    { title: "Reports Generated", value: 7, color: "bg-blue-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className={`p-6 rounded-xl shadow-lg text-white ${stat.color}`}>
          <h3 className="text-lg font-semibold">{stat.title}</h3>
          <p className="text-2xl font-bold mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
