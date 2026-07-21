'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import {
  Home, BookOpen, ListTree, MessageCircle, PenSquare,
  UserCircle, ChevronLeft, ChevronRight, ChevronDown, X, Gamepad2,
  Monitor, Cloud, Smartphone,
} from 'lucide-react';

interface SidebarGroup {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: { href: string; label: string }[];
}

interface SidebarSection {
  href?: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  groups?: SidebarGroup[];
  children?: { href: string; label: string }[];
}

const SIDEBAR_MAIN: SidebarSection[] = [
  { href: '/', label: 'Главная', icon: Home },
  {
    label: 'Инструкции',
    icon: BookOpen,
    href: '/instructions',
    groups: [
      {
        label: 'Десктоп',
        icon: Monitor,
        items: [
          { href: '/instructions/rkeeper/rk7', label: 'r_keeper 7' },
          { href: '/instructions/rkeeper/storehouse', label: 'StoreHouse Pro' },
        ],
      },
      {
        label: 'Облачные сервисы',
        icon: Cloud,
        items: [
          { href: '/instructions/rkeeper/delivery', label: 'Delivery' },
          { href: '/instructions/rkeeper/event', label: 'Event' },
        ],
      },
      {
        label: 'Мобильные',
        icon: Smartphone,
        items: [
          { href: '/instructions/rkeeper/waiter', label: 'Waiter & Cash Desk' },
        ],
      },
    ],
  },
  {
    label: 'Услуги',
    icon: ListTree,
    children: [
      { href: '/booking', label: 'Консультации' },
      { href: '/booking', label: 'Обучение' },
    ],
  },
  { href: '/chat', label: 'Чат с отделом', icon: MessageCircle },
  { href: '/quiz', label: 'Викторина (Игра)', icon: Gamepad2 },
];

function getAccountHref(user: { role: string } | null, isAuthenticated: boolean): string {
  if (!isAuthenticated || !user) return '/';
  const staff = user.role === 'admin' || user.role === 'company_admin' || user.role === 'specialist';
  return staff ? '/admin/dashboard' : '/profile';
}

export function SidebarLeft() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [collapsed, setCollapsed] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  const effectiveUser = hydrated ? user : null;
  const effectiveAuth = hydrated && isAuthenticated;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline transition-all shrink-0 ${
       active
        ? 'bg-gradient-to-r from-[#1a56db]/10 to-[#0d9488]/10 text-[#1a56db] font-semibold'
        : 'text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5'
    }`;

  const labelClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline transition-all cursor-pointer select-none shrink-0 ${
      active
        ? 'bg-gradient-to-r from-[#1a56db]/10 to-[#0d9488]/10 text-[#1a56db] font-semibold'
        : 'text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5'
    }`;

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          flex flex-col h-screen top-0 z-50 transition-all duration-300 overflow-hidden
          glass-sidebar border-r border-white/20

          fixed inset-y-0 left-0 w-60
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:sticky self-start md:z-30

          md:w-16

          ${collapsed ? 'lg:w-16' : 'lg:w-60'}
        `}
      >
        <div className="px-4 py-4 border-b border-[#e5e7eb]/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className={`no-underline ${collapsed ? 'mx-auto' : 'md:hidden lg:block'}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className={`whitespace-nowrap flex items-center justify-center rounded-lg bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white text-sm font-bold ${collapsed ? 'w-8 h-8 mx-auto' : 'px-3 py-1.5'}`}>
                {collapsed ? 'U' : 'UCS service'}
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:text-[#dc2626] hover:bg-red-50 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-0.5 px-3 py-3">
          {SIDEBAR_MAIN.map((item) => {
            if ('groups' in item && item.groups) {
              const Icon = item.icon!;
              const open = instructionsOpen;
              const toggle = () => setInstructionsOpen(!instructionsOpen);
              return (
                <div key={item.label}>
                  <Link
                    href={item.href!}
                    onClick={() => { setSidebarOpen(false); setInstructionsOpen(true); }}
                    className={labelClass(isActive(item.href!))}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className={`flex-1 md:hidden ${!collapsed ? 'lg:block' : ''}`}>{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#9ca3af] transition-transform ${open ? 'rotate-0' : '-rotate-90'} md:hidden ${!collapsed ? 'lg:block' : ''}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
                    />
                  </Link>
                  {open && (
                    <div className={`ml-2 mt-0.5 space-y-1 md:hidden ${!collapsed ? 'lg:block' : ''}`}>
                      {item.groups.map((group) => (
                        <div key={group.label}>
                          <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                            <group.icon className="w-3 h-3" />
                            {group.label}
                          </div>
                          <div className="ml-4 space-y-0.5 border-l-2 border-[#e5e7eb] pl-2">
                            {group.items.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm no-underline transition-all ${
                                  isActive(child.href)
                                    ? 'text-[#1a56db] font-semibold bg-[#1a56db]/5'
                                    : 'text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5'
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                                <span>{child.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if ('children' in item && item.children) {
              const Icon = item.icon!;
              const open = servicesOpen;
              const toggle = () => setServicesOpen(!servicesOpen);
              return (
                <div key={item.label}>
                  <div
                    onClick={toggle}
                    className={labelClass(false)}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className={`flex-1 md:hidden ${!collapsed ? 'lg:block' : ''}`}>{item.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#9ca3af] transition-transform ${open ? 'rotate-0' : '-rotate-90'} md:hidden ${!collapsed ? 'lg:block' : ''}`}
                    />
                  </div>
                  {open && (
                    <div className={`ml-7 mt-0.5 space-y-0.5 border-l-2 border-[#e5e7eb] pl-2 md:hidden ${!collapsed ? 'lg:block' : ''}`}>
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm no-underline transition-all ${
                            isActive(child.href)
                              ? 'text-[#1a56db] font-semibold bg-[#1a56db]/5'
                              : 'text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/5'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const Icon = item.icon!;
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setSidebarOpen(false)}
                className={linkClass(isActive(item.href!))}
                title={item.label}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className={`md:hidden ${!collapsed ? 'lg:block' : ''}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#e5e7eb]/50 px-3 py-3 space-y-2 shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-full items-center justify-center h-8 rounded-lg text-[#9ca3af] hover:text-[#1a56db] hover:bg-[#1a56db]/5 transition-all"
            title={collapsed ? 'Развернуть' : 'Свернуть'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <Link
            href="/booking"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white no-underline transition-all bg-gradient-to-r from-[#1a56db] to-[#0d9488] shadow-md hover:shadow-lg hover:-translate-y-0.5 md:hidden ${!collapsed ? 'lg:flex' : ''}`}
          >
            <PenSquare className="w-4 h-4" />
            Записаться
          </Link>

          <Link
            href={getAccountHref(effectiveUser, effectiveAuth)}
            onClick={() => setSidebarOpen(false)}
            className={linkClass(isActive(getAccountHref(effectiveUser, effectiveAuth)))}
            title="Личный кабинет"
          >
            <UserCircle className="w-5 h-5 shrink-0" />
            <span className={`md:hidden ${!collapsed ? 'lg:block' : ''}`}>Личный кабинет</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
