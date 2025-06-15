import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Info, BookOpenText, Leaf, Store, Mail, LogIn, LogOut, Calendar } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const AppSidebar: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-2">
        <h2 className="text-lg font-semibold px-2">{t('appTitle')}</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation.sidebarHeader')}</SidebarGroupLabel>
          <SidebarMenu>
            {/* Mein Profil Link */}
            {session && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/profile'}
                  tooltip={t('navigation.profile', 'Mein Profil')}
                >
                  <Link to="/profile">
                    <span className="w-4 h-4 border rounded-full mr-2 bg-gray-200 inline-block" />
                    <span>{t('navigation.profile', 'Mein Profil')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === '/'}
                tooltip={t('navigation.home')}
              >
                <Link to="/">
                  <Home className="h-4 w-4" />
                  <span>{t('navigation.home')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === '/about'}
                tooltip={t('navigation.about')}
              >
                <Link to="/about">
                  <Info className="h-4 w-4" />
                  <span>{t('navigation.about')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Rezepte-Gruppe mit Unterpunkten */}
            <SidebarGroupLabel className="mt-4">{t('navigation.recipes')}</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === '/recipes'}
                  tooltip={t('navigation.recipes')}
                >
                  <Link to="/recipes">
                    <BookOpenText className="h-4 w-4" />
                    <span>{t('navigation.allRecipes', 'Alle Rezepte')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {session && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === '/recipes/my'}
                    tooltip={t('navigation.myRecipes')}
                  >
                    <Link to="/recipes/my">
                      <BookOpenText className="h-4 w-4" />
                      <span>{t('navigation.myRecipes', 'Meine Rezepte')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
            {/* Wochenplan separat */}
            <SidebarGroupLabel className="mt-4">{t('navigation.mealPlan')}</SidebarGroupLabel>
            <SidebarMenu>
              {session && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === '/meal-plan'}
                    tooltip={t('navigation.mealPlan')}
                  >
                    <Link to="/meal-plan">
                      <Calendar className="h-4 w-4" />
                      <span>{t('navigation.mealPlan', 'Mein Wochenplan')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
            {/* ... weitere bestehende Links, z.B. Nutrition, Restaurants, Contact ... */}
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === '/nutrition'}
                tooltip={t('navigation.nutrition')}
              >
                <Link to="/nutrition">
                  <Leaf className="h-4 w-4" />
                  <span>{t('navigation.nutrition')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === '/restaurants'}
                tooltip={t('navigation.restaurants')}
              >
                <Link to="/restaurants">
                  <Store className="h-4 w-4" />
                  <span>{t('navigation.restaurants')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === '/contact'}
                tooltip={t('navigation.contact')}
              >
                <Link to="/contact">
                  <Mail className="h-4 w-4" />
                  <span>{t('navigation.contact')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {session ? (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip={t('navigation.logout', 'Logout')}>
                <LogOut className="h-4 w-4" />
                <span>{t('navigation.logout', 'Logout')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === '/auth'}
                tooltip={t('navigation.login', 'Login')}
              >
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  <span>{t('navigation.login', 'Login')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
