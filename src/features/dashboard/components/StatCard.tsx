import { Card, CardContent } from '@/shared/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  change?: number;
  dropdown?: boolean;
  navigateTo?: string;
}

export function StatCard({ label, value, subtitle, change, dropdown = false, navigateTo }: StatCardProps) {

    const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };
  
  return (
     <Card 
      className={`bg-white ${navigateTo ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">{label}</p>
          {dropdown && (
            <select className="text-xs border border-gray-300 rounded px-2 py-1" onClick={(e) => e.stopPropagation()}>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <div className="flex items-center gap-2 text-sm">
          <p className="text-gray-600">{subtitle}</p>
          {change !== undefined && (
            <span className="flex items-center text-green-600 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{change}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}