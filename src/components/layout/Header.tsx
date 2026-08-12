import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

export default function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <header className="relative bg-brand-dark text-white rounded-2xl overflow-hidden shadow-md mb-6 border border-brand-forest/30">
      {/* Restrained background asset overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
        style={{ backgroundImage: `url('/assets/kpi-background.png')` }}
      />
      {/* Gradient mask for excellent text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/80 to-transparent" />
      
      {/* Content wrapper */}
      <div className="relative z-10 p-6 lg:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2 text-[10px] select-none">
            <span className="font-extrabold tracking-wider bg-brand-lime/25 text-brand-lime px-2.5 py-0.5 rounded-full border border-brand-lime/30 uppercase">
              Dataset: BlinkIT Grocery Data
            </span>
            <span className="font-extrabold bg-white/10 text-zinc-300 px-2 py-0.5 rounded-full border border-white/5 uppercase tracking-wide">
              8,523 records
            </span>
            <span className="text-zinc-400 font-medium ml-1">
              Dataset-powered analytics • Not live BlinkIT data
            </span>
          </div>
          
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-1.5 font-display">
            {title}
          </h2>
          <p className="text-sm text-zinc-300 font-medium max-w-xl leading-relaxed">
            {subtitle}
          </p>
        </div>
        
        {children && (
          <div className="flex items-center gap-3 self-start md:self-auto">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
