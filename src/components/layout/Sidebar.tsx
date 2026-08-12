import { LayoutDashboard, TrendingUp, ShoppingBag, Store, Menu, X } from 'lucide-react';
import type { PageType } from '../../types';

interface SidebarProps {
  activePage: PageType;
  onNavigate: (page: PageType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ activePage, onNavigate, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'overview', name: 'Executive Overview', icon: LayoutDashboard },
    { id: 'sales', name: 'Sales Analytics', icon: TrendingUp },
    { id: 'products', name: 'Product Analytics', icon: ShoppingBag },
    { id: 'outlets', name: 'Outlet Analytics', icon: Store },
  ] as const;

  const handleNav = (page: PageType) => {
    onNavigate(page);
    setIsOpen(false); // Close mobile drawer
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-brand-dark text-white px-4 py-3 sticky top-0 z-40 shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-brand-lime flex items-center justify-center text-brand-dark font-extrabold text-sm">
            QCI
          </div>
          <span className="font-display font-bold tracking-tight">QuickCommerce Intelligence</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-md hover:bg-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-lime text-brand-lime"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-30 lg:z-20 w-64 bg-brand-dark text-white border-r border-brand-forest/30 flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:sticky lg:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="hidden lg:flex items-center space-x-3 px-6 py-6 border-b border-brand-forest/20">
          <div className="w-10 h-10 rounded-xl bg-brand-lime flex items-center justify-center text-brand-dark font-extrabold text-lg shadow-sm">
            QCI
          </div>
          <div>
            <h1 className="font-display font-extrabold text-base tracking-tight leading-none m-0 text-white">
              QuickCommerce
            </h1>
            <span className="text-[11px] font-semibold tracking-wider text-brand-lime uppercase leading-none block mt-1">
              Intelligence
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`
                  w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl font-display text-sm font-semibold transition-all duration-200 group
                  ${isActive 
                    ? 'bg-brand-lime text-brand-dark shadow-sm' 
                    : 'text-brand-muted hover:text-white hover:bg-brand-forest/20'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-brand-dark' : 'text-brand-muted group-hover:text-brand-lime'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-brand-forest/20 text-center">
          <p className="text-[10px] text-brand-muted/70">
            v1.0.0 • Portfolio Project
          </p>
          <p className="text-[9px] text-brand-muted/50 mt-1">
            Data sourced from BlinkIT dataset
          </p>
        </div>
      </aside>
    </>
  );
}
