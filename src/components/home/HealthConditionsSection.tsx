import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  ShieldPlus, 
  Smile, 
  HeartPulse, 
  Moon, 
  Cross, 
  ArrowRight,
  Award
} from 'lucide-react';
import { healthConditions } from '../../data/offers';

const iconMap: Record<string, React.ElementType> = {
  Activity,
  ShieldPlus,
  Smile,
  HeartPulse,
  Moon,
  Cross
};

export const HealthConditionsSection: React.FC = () => {
  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-wine-700 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Targeted Care</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shop by Health Concern
          </h2>
        </div>

        <Link
          to="/products"
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
        >
          <span>All Concerns</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Conditions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {healthConditions.map((cond) => {
          const IconComp = iconMap[cond.icon] || Activity;

          return (
            <Link
              key={cond.id}
              to={cond.link}
              className="group p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-500 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${cond.color} group-hover:scale-110 transition-transform`}>
                <IconComp className="w-6 h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight mb-1">
                {cond.name}
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {cond.subtitle}
              </p>
            </Link>
          );
        })}
      </div>

    </section>
  );
};
