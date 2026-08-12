import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';

interface KPICardProps {
  title: string;
  value: number;
  formatter: (val: number) => string;
  icon: ComponentType<{ className?: string }>;
  description?: string;
}

export default function KPICard({ title, value, formatter, icon: Icon, description }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }
    
    // Duration of animation in ms
    const duration = 1200;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const currentVal = start + (end - start) * easeProgress;
      
      setDisplayValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    }

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center space-x-4 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Icon frame */}
      <div className="p-3.5 rounded-xl bg-brand-forest/5 text-brand-forest group-hover:bg-brand-lime group-hover:text-brand-dark transition-all duration-300">
        <Icon className="w-6 h-6 flex-shrink-0" />
      </div>
      
      {/* Values */}
      <div className="flex-1 min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
          {title}
        </span>
        <span className="block text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5 font-display tabular-nums">
          {formatter(displayValue)}
        </span>
        {description && (
          <span className="block text-[11px] text-slate-500 font-semibold mt-0.5 leading-normal">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}
