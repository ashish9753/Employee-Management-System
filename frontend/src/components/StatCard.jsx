const StatCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const gradients = {
    blue: "from-blue-500 to-blue-700",
    green: "from-emerald-500 to-green-600",
    yellow: "from-orange-400 to-orange-600",
    red: "from-rose-500 to-red-600",
    purple: "from-purple-500 to-violet-600",
    teal: "from-teal-500 to-cyan-600",
  };

  const gradient = gradients[color] || gradients.blue;

  return (
    <div className={`rounded-2xl p-5 text-white bg-gradient-to-br ${gradient} shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-white/80 leading-snug">{title}</p>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon size={20} />
        </div>
      </div>
      <p className="text-4xl font-extrabold">{value}</p>
      {subtitle && <p className="text-xs text-white/70 mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
