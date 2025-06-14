
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Info, BookOpenText, Leaf, Store, Mail, LogIn, LogOut } from 'lucide-react';
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

const navItems = [
  { to: '/', labelKey: 'navigation.home', Icon: Home },
  { to: '/about', labelKey: 'navigation.about', Icon: Info },
  { to: '/recipes', labelKey: 'navigation.recipes', Icon: BookOpenText },
  { to: '/nutrition', labelKey: 'navigation.nutrition', Icon: Leaf },
  { to: '/restaurants', labelKey: 'navigation.restaurants', Icon: Store },
  { to: '/contact', labelKey: 'navigation.contact', Icon: Mail },
];

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
         {/* The SidebarTrigger from App.tsx will handle toggling for mobile,
             but we might want a desktop toggle button here if not using the rail exclusively.
             For now, the global trigger in App.tsx main content is sufficient.
          */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('navigation.sidebarHeader')}</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.to}
                  tooltip={t(item.labelKey)}
                >
                  <Link to={item.to}>
                    <item.Icon className="h-4 w-4" />
                    <span>{t(item.labelKey)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
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
