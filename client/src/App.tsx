import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Parcels from "./pages/Parcels";
import CreateShipment from "./pages/CreateShipment";
import ShipmentQuote from "./pages/ShipmentQuote";
import Projects from "./pages/Projects";
import WeeklyPlan from "./pages/WeeklyPlan";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/parcels"} component={Parcels} />
      <Route path={"/create-shipment"} component={CreateShipment} />
      <Route path={"/shipment-quote"} component={ShipmentQuote} />
      <Route path={"/projects"} component={Projects} />
      <Route path={"/weekly-plan"} component={WeeklyPlan} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-6 overflow-y-auto">
              <Router />
            </main>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
