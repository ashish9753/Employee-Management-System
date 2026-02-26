import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiCheckSquare,
  FiUsers,
  FiBarChart2,
  FiShield,
  FiClock,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";

const features = [
  {
    icon: FiCalendar,
    title: "Easy Leave Requests",
    desc: "Employees can apply for annual, sick, casual, or unpaid leave in seconds with a simple form.",
    color: "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  },
  {
    icon: FiCheckSquare,
    title: "Instant Approvals",
    desc: "Managers review and approve or reject requests with a single click and optional review notes.",
    color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    icon: FiUsers,
    title: "User Management",
    desc: "Admins control roles, departments, and account status for every employee in the system.",
    color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  },
  {
    icon: FiBarChart2,
    title: "Analytics Dashboard",
    desc: "Visual reports on leave trends, type breakdowns, and monthly application volumes.",
    color: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    icon: FiShield,
    title: "Role-Based Access",
    desc: "Secure JWT authentication with Admin, Manager, and Employee permission levels.",
    color: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  },
  {
    icon: FiClock,
    title: "Real-Time Tracking",
    desc: "Live leave balance tracking with automatic deductions upon approval.",
    color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
];

const roles = [
  {
    role: "Employee",
    color: "border-teal-500",
    headerColor: "bg-gradient-to-br from-teal-500 to-teal-600",
    perks: [
      "Apply for leave online",
      "Track leave status (Pending / Approved / Rejected)",
      "View remaining leave balance",
      "Cancel pending requests",
      "Update personal profile",
    ],
  },
  {
    role: "Manager",
    color: "border-green-500",
    headerColor: "bg-gradient-to-br from-green-500 to-green-600",
    perks: [
      "View all employee leave requests",
      "Approve or reject with notes",
      "Filter by status or type",
      "Apply for own leaves",
      "Monitor team attendance",
    ],
  },
  {
    role: "Admin",
    color: "border-[#1a2844]",
    headerColor: "bg-gradient-to-br from-[#1a2844] to-[#243660]",
    perks: [
      "Full user management",
      "Assign roles & departments",
      "Activate / deactivate accounts",
      "View system-wide analytics",
      "Manage all leave records",
    ],
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      {/* ── Navbar ── */}
      <header className="bg-[#1a2844] text-white shadow-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center font-bold text-sm">
              L
            </div>
            <span className="font-bold text-lg">LeaveMS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-white/70 hover:text-white transition px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-teal-400 to-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition shadow"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-[#1a2844] via-[#1e3255] to-[#243660] text-white">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            HR Leave Management System
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Manage Employee Leaves
            <br className="hidden md:block" />
            <span className="text-teal-400"> Effortlessly</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A complete leave management solution for modern companies — apply,
            approve, track, and analyse all employee leave requests in one
            place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition text-base shadow-lg"
            >
              Get Started Free <FiArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition text-base"
            >
              Sign In
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              ["3", "Roles"],
              ["6+", "Features"],
              ["100%", "Secure"],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-extrabold text-white">{val}</p>
                <p className="text-teal-400 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Built with industry-standard tools to automate and simplify your
              HR leave workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}
                >
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white text-lg mb-2">
                  {title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Built for Every Role
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Tailored dashboards and permissions for Admins, Managers, and
              Employees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map(({ role, color, headerColor, perks }) => (
              <div
                key={role}
                className={`rounded-2xl border-2 ${color} overflow-hidden shadow-sm hover:shadow-md transition dark:bg-gray-800`}
              >
                <div className={`${headerColor} text-white px-6 py-5`}>
                  <h3 className="text-xl font-bold">{role}</h3>
                  <p className="text-white/70 text-sm mt-0.5">
                    Dedicated portal &amp; features
                  </p>
                </div>
                <div className="p-6 space-y-3">
                  {perks.map((perk) => (
                    <div key={perk} className="flex items-start gap-3">
                      <FiCheck
                        className="text-green-500 mt-0.5 shrink-0"
                        size={16}
                      />
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {perk}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-10">
            Built with Modern Tech
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "React.js",
              "Tailwind CSS",
              "React Router",
              "Context API",
              "Node.js",
              "Express.js",
              "MongoDB",
              "JWT Auth",
            ].map((tech) => (
              <span
                key={tech}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium px-5 py-2.5 rounded-full text-sm shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-[#1a2844] via-[#1e3255] to-[#243660] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Create your account now and experience a smarter way to manage
            company leaves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold px-8 py-4 rounded-xl hover:opacity-90 transition shadow-lg"
            >
              Create Account <FiArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition"
            >
              Sign In
            </Link>
          </div>

          
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#1a2844] border-t border-white/10 text-white/40 py-8 text-center text-sm">
        <p>
          © 2026 <span className="text-teal-400 font-semibold">LeaveMS</span> —
          Employee Leave Management System
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
