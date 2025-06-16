
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import RecipesPage from "./pages/RecipesPage";
import NutritionPage from "./pages/NutritionPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import Imprint from "./pages/Imprint";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { AuthProvider } from "@/contexts/AuthContext";
import ProfilePage from "./pages/ProfilePage";
import BusinessProfileSearchPage from "./pages/BusinessProfileSearchPage";
import DiscoverPage from "./pages/DiscoverPage";
import CookieConsent from "react-cookie-consent";
import AppFooter from "@/components/footer/AppFooter";

// NEU:
import PrivateRoute from "@/routes/PrivateRoute";
import MyRecipes from "@/pages/MyRecipes";
import MealPlan from "@/pages/MealPlan";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full bg-background">
              <AppSidebar />
              <SidebarInset className="flex flex-col flex-1">
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <SidebarTrigger className="md:hidden" />
                    <div className="ml-auto">
                      <LanguageSwitcher />
                    </div>
                  </div>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route
                      path="/recipes/my"
                      element={
                        <PrivateRoute>
                          <MyRecipes />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/meal-plan"
                      element={
                        <PrivateRoute>
                          <MealPlan />
                        </PrivateRoute>
                      }
                    />
                    {/* Alt-URL Redirect für Bookmarks */}
                    <Route path="/my-recipes" element={<Navigate to="/recipes/my" replace />} />
                    <Route path="/nutrition" element={<NutritionPage />} />
                    <Route path="/restaurants" element={<RestaurantsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <ProfilePage />
                        </PrivateRoute>
                      }
                    />
                    <Route path="/business-search" element={<BusinessProfileSearchPage />} />
                    <Route path="/restaurant-suche" element={<DiscoverPage />} />
                    <Route path="/imprint" element={<Imprint />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <AppFooter />
              </SidebarInset>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </BrowserRouter>
      {/* DSGVO Third-Party Consent Banner */}
      <CookieConsent
        location="bottom"
        buttonText="Akzeptieren"
        declineButtonText="Ablehnen"
        enableDeclineButton
        cookieName="matbakh_consent_thirdparty"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
        onAccept={() => {
          localStorage.setItem("matbakh_consent_thirdparty", "true");
        }}
        onDecline={() => {
          localStorage.setItem("matbakh_consent_thirdparty", "false");
        }}
      >
        Diese Seite verwendet Google Maps, um Restaurants in deiner Nähe anzuzeigen.
        Wenn du zustimmst, werden externe Skripte geladen.
      </CookieConsent>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
