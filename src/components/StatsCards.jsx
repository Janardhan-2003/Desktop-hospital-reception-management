import { Calendar, Users, TrendingUp, Activity } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: "Today's Visits",
      value: stats?.today || 0,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "This Month",
      value: stats?.month || 0,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Patients",
      value: stats?.total || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "This Week",
      value: stats?.week || 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 px-6 py-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={`${card.color} w-5 h-5`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;