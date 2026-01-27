import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Kontakt from "./pages/Kontakt";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/kontakt" component={Kontakt} />
        {/* Placeholder routes for now, redirecting to Home or NotFound could be better but let's keep it simple */}
        <Route path="/loesungen" component={Home} /> 
        <Route path="/referenzen" component={Home} />
        <Route path="/ueber-uns" component={Home} />
        <Route path="/impressum" component={Home} />
        <Route path="/datenschutz" component={Home} />
        <Route path="/agb" component={Home} />
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
