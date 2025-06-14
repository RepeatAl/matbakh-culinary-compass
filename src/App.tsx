
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import RecipesPage from "./pages/RecipesPage";
import NutritionPage from "./pages/NutritionPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage"; // AuthPage importieren
import NotFound from "./pages/NotFound";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { AuthProvider } from "@/contexts/AuthContext"; // AuthProvider importieren

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider defaultOpen={true}> {/* defaultOpen auf true für sichtbare Sidebar initial */}
            <div className="flex min-h-screen w-full bg-background"> {/* Ensure w-full for SidebarProvider */}
              <AppSidebar />
              <SidebarInset> {/* Umschließt den Hauptinhalt */}
                <div className="p-4"> {/* Padding für den Inhalt neben der Sidebar */}
                  <div className="flex justify-between items-center mb-4">
                    <SidebarTrigger className="md:hidden" /> {/* Nur auf mobilen Geräten anzeigen, Desktop-Toggle über Rail/Shortcut */}
                    <div className="ml-auto"> {/* LanguageSwitcher nach rechts */}
                      <LanguageSwitcher />
                    </div>
                  </div>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/nutrition" element={<NutritionPage />} />
                    <Route path="/restaurants" element={<RestaurantsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/auth" element={<AuthPage />} /> {/* Route für AuthPage */}
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
