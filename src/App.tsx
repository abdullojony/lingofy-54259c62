
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ReactNode } from "react";
import Index from "./pages/Index";
import Lesson from "./pages/Lesson";
import Module from "./pages/Module";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

// Create a wrapper component for QueryClientProvider
const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const App = () => (
  <QueryProvider>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lesson" element={<Lesson />} />
            <Route path="/module/:id" element={<Module />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/practice" element={<Lesson />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryProvider>
);

export default App;
