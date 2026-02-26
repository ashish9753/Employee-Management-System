import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { updateProfileAPI } from "../../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    department: user?.department || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateProfileAPI(form);
      updateUser(data.user);
      toast.success("Profile updated!");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const roleColors = { employee: "blue", manager: "green", admin: "purple" };
  const roleColor = roleColors[user?.role] || "blue";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          My Profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Manage your account information
        </p>

        {/* Avatar Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 flex items-center gap-5">
          <div
            className={`w-20 h-20 rounded-full bg-${roleColor}-100 flex items-center justify-center text-3xl font-bold text-${roleColor}-700`}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold capitalize bg-${roleColor}-100 text-${roleColor}-700`}
            >
              {user?.role}
            </span>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Leave Balance
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {["annual", "sick", "casual"].map((type) => (
              <div
                key={type}
                className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {user?.leaveBalance?.[type] ?? 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-1">
                  {type}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Edit Information
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                value={user?.email}
                disabled
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <select
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[
                  "General",
                  "Engineering",
                  "Marketing",
                  "HR",
                  "Finance",
                  "Operations",
                  "Sales",
                ].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
