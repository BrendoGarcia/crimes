import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "critical" | "warning";
  className?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  variant = "default",
  className 
}: MetricCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "critical":
        return "border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-background";
      case "warning":
        return "border-l-4 border-l-crime-warning bg-gradient-to-r from-crime-warning/5 to-background";
      default:
        return "border-border";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-primary";
      case "down":
        return "text-crime-warning";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={cn("metric-card hover:shadow-elevated transition-all duration-300", getVariantStyles(), className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {trend && (
            <span className={cn("text-sm font-medium", getTrendColor())}>
              {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};