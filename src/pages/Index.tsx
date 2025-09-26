import { useState } from "react";
import { Navigation } from "@/components/Layout/Navigation";
import { OverviewScreen } from "@/screens/OverviewScreen";
import { MetricsScreen } from "@/screens/MetricsScreen";
import { AnalysisScreen } from "@/screens/AnalysisScreen";
import { SimulationScreen } from "@/screens/SimulationScreen";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState("overview");

  const renderScreen = () => {
    switch (currentScreen) {
      case "metrics":
        return <MetricsScreen />;
      case "analysis":
        return <AnalysisScreen />;
      case "simulation":
        return <SimulationScreen />;
      default:
        return <OverviewScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentScreen={currentScreen} 
        onScreenChange={setCurrentScreen} 
      />
      <main className="slide-in">
        {renderScreen()}
      </main>
    </div>
  );
};

export default Index;
