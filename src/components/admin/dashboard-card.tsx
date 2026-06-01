import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function DashboardCard({ title, value, icon, description, trend }: DashboardCardProps) {
  return (
    <Card className="rounded-none border-outline-variant/50 shadow-sm bg-surface">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-widest text-on-surface-variant">
          {title}
        </CardTitle>
        {icon && <div className="text-on-surface-variant h-4 w-4">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-light text-primary">{value}</div>
        {(description || trend) && (
          <div className="flex items-center mt-2 text-xs text-on-surface-variant">
            {trend && (
              <span className={`mr-2 font-medium ${trend.isPositive ? 'text-green-600' : 'text-error'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
            {description && <p>{description}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
