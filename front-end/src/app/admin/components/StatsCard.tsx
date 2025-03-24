interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }
  
  export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
    return (
      <div className={`p-6 rounded-lg shadow-md flex items-center space-x-4 ${color}`}>
        <div className="text-3xl text-white">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    );
  }
  