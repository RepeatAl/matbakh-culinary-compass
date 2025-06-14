
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Info, BookOpenText, Leaf, Store, Mail, PanelLeft } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button"; // Import Button for the trigger

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
    </Sidebar>
  );
};
