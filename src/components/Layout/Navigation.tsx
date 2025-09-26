import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavigationProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

const screens = [
  { id: 'overview', label: 'Panorama' },
  { id: 'metrics', label: 'Métricas' },
  { id: 'analysis', label: 'Análise' },
  { id: 'simulation', label: 'Simulação' }
];

export const Navigation = ({ currentScreen, onScreenChange }: NavigationProps) => {
  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PE</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Análise Criminal - PE</h1>
          </div>
          
          <div className="flex space-x-2">
            {screens.map((screen) => (
              <Button
                key={screen.id}
                variant={currentScreen === screen.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onScreenChange(screen.id)}
                className={cn(
                  "transition-all duration-200",
                  currentScreen === screen.id 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {screen.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};