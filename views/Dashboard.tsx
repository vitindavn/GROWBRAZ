
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GrowSpace, Plant, GrowStage } from '../types';
import { PlusIcon, BeakerIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

interface DashboardProps {
  plants: Plant[];
  spaces: GrowSpace[];
}

const Dashboard: React.FC<DashboardProps> = ({ plants, spaces }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-bold">Seus Jardins</h2>
            <p className="text-slate-400 text-sm">Visão geral do cultivo ativo</p>
          </div>
          <button className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
            Ver Tudo <ArrowRightIcon className="w-3 h-3" />
          </button>
        </div>

        <div className="grid gap-4">
          {spaces.map(space => {
            const spacePlants = plants.filter(p => p.growSpaceId === space.id);
            return (
              <div 
                key={space.id} 
                onClick={() => navigate('/grows')}
                className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{space.name}</h3>
                    <p className="text-xs text-slate-500">{space.dimensions} • {space.lightPower}W {space.lightType}</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded uppercase">Ativo</span>
                </div>
                
                <div className="flex -space-x-2">
                  {spacePlants.length > 0 ? spacePlants.map(p => (
                    <div key={p.id} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center overflow-hidden">
                      <img src={`https://picsum.photos/seed/${p.id}/100/100`} alt={p.name} />
                    </div>
                  )) : <p className="text-xs text-slate-500 italic">Sem plantas neste espaço</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Plantas Ativas</h2>
          <button className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl transition-colors">
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {plants.map(plant => (
            <div 
              key={plant.id}
              onClick={() => navigate(`/plant/${plant.id}`)}
              className="flex items-center bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-700 mr-4 shrink-0">
                <img src={`https://picsum.photos/seed/${plant.id}/200/200`} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold truncate">{plant.name}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                    plant.currentStage === GrowStage.FLOWERING ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {plant.currentStage === GrowStage.VEGETATIVE ? 'Vegetativo' : 
                     plant.currentStage === GrowStage.FLOWERING ? 'Floração' : 
                     plant.currentStage === GrowStage.GERMINATION ? 'Germinação' :
                     plant.currentStage === GrowStage.SEEDLING ? 'Plântula' : 'Colhida'}
                  </span>
                </div>
                <p className="text-sm text-slate-400 truncate">{plant.strain}</p>
                <div className="mt-2 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden group">
        <div className="relative z-10">
          <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-4 text-cyan-400">
            <BeakerIcon className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold mb-2">Manutenção Inteligente</h3>
          <p className="text-slate-400 text-sm mb-4">Hora de alimentar? Glookies #1 precisa de um flush de nutrientes em 4 horas.</p>
          <button className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-sm hover:bg-cyan-400 transition-colors">
            Definir Lembrete
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors"></div>
      </div>
    </div>
  );
};

export default Dashboard;
