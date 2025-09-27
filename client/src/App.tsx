import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminServices from "@/pages/AdminServices";
import AdminPackages from "@/pages/AdminPackages";
import AdminBlog from "@/pages/AdminBlog";
import AdminTestimonials from "@/pages/AdminTestimonials";
import AuthGuard from "@/components/AuthGuard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={() => <AuthGuard><AdminDashboard /></AuthGuard>} />
      <Route path="/admin/services" component={() => <AuthGuard><AdminServices /></AuthGuard>} />
      <Route path="/admin/packages" component={() => <AuthGuard><AdminPackages /></AuthGuard>} />
      <Route path="/admin/blog" component={() => <AuthGuard><AdminBlog /></AuthGuard>} />
      <Route path="/admin/testimonials" component={() => <AuthGuard><AdminTestimonials /></AuthGuard>} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
