import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Activity,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile toggle
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-gray-100 px-4 py-3 shadow-lg">
        <h1 className="text-xl font-bold text-blue-400">SOC</h1>
        <button onClick={() => setMobileOpen(true)} className="text-gray-300">
          <Menu size={26} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          open ? "w-64" : "w-20"
        } bg-gray-900 text-gray-100 min-h-screen flex flex-col shadow-xl transition-all duration-300 
        fixed md:static top-0 left-0 z-50 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {open && (
            <h1 className="text-xl font-extrabold text-blue-400 tracking-wide">
              SOC Dashboard
            </h1>
          )}
          <button
            onClick={() => (window.innerWidth < 768 ? setMobileOpen(false) : setOpen(!open))}
            className="text-gray-400 hover:text-white"
          >
            {window.innerWidth < 768 ? <X size={22} /> : open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-3">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-blue-400 transition"
              >
                <LayoutDashboard size={20} />
                {open && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/incidents"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-blue-400 transition"
              >
                <AlertTriangle size={20} />
                {open && <span>Incidents</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/reports"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-blue-400 transition"
              >
                <FileText size={20} />
                {open && <span>Reports</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/simulator"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 hover:text-blue-400 transition"
              >
                <Activity size={20} />
                {open && <span>Simulator</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg 
                       text-red-400 hover:bg-red-600 hover:text-white transition"
          >
            <LogOut size={20} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        ></div>
      )}
    </>
  );
}
