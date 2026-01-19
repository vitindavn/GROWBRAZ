
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrowSpace, Plant, GrowStage, Genetics } from '../types';
import { PlusIcon, BeakerIcon, ArrowRightIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface DashboardProps {
  plants: Plant[];
  setPlants: React.Dispatch<React.SetStateAction<Plant[]>>;
  spaces: GrowSpace[];
}

const Dashboard: React.FC<DashboardProps> = ({ plants, setPlants, spaces }) => {
  const navigate = useNavigate();
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '',
    strain: '',
    genetics: Genetics.PHOTO,
    seedBank: '',
    growSpaceId: spaces[0]?.id || ''
  });

  const handleAddPlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlant.name || !newPlant.growSpaceId) return;

    const plant: Plant = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPlant.name,
      strain: newPlant.strain || 'Strain Desconhecida',
      genetics: newPlant.genetics,
      seedBank: newPlant.seedBank || 'N/A',
      growSpaceId: newPlant.growSpaceId,
      startDate: Date.now(),
      currentStage: GrowStage.GERMINATION,
      logs: []
    };

    setPlants([...plants, plant]);
    setShowAddPlant(false);
    setNewPlant({ name: '', strain: '', genetics: Genetics.PHOTO, seedBank: '', growSpaceId: spaces[0]?.id || '' });
  };

  const getStageProgress = (stage: GrowStage) => {
    switch (stage) {
      case GrowStage.GERMINATION: return 'w-[10%] bg-yellow-400';
      case GrowStage.SEEDLING: return 'w-[25%] bg-lime-400';
      case GrowStage.VEGETATIVE: return 'w-[50%] bg-emerald-500';
      case GrowStage.FLOWERING: return 'w-[85%] bg-pink-400';
      case GrowStage.HARVESTED: return 'w-[100%] bg-amber-600';
      default: return 'w-0';
    }
  };

  const translateStage = (stage: GrowStage) => {
    const stages: Record<GrowStage, string> = {
      [GrowStage.GERMINATION]: 'Germinação',
      [GrowStage.SEEDLING]: 'Plântula',
      [GrowStage.VEGETATIVE]: 'Vegetativo',
      [GrowStage.FLOWERING]: 'Floração',
      [GrowStage.HARVESTED]: 'Colhida',
    };
    return stages[stage];
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-bold">Seus Jardins</h2>
            <p className="text-slate-400 text-sm">Visão geral do cultivo ativo</p>
          </div>
          <button onClick={() => navigate('/grows')} className="text-emerald-400 text-sm font-semibold flex items-center gap-1 hover:underline">
            Ver Tudo <ArrowRightIcon className="w-3 h-3" />
          </button>
        </div>

        <div className="grid gap-4">
          {spaces.length === 0 ? (
            <div className="bg-slate-800/30 border-2 border-dashed border-slate-700 p-6 rounded-2xl text-center text-slate-500">
              Nenhum espaço cadastrado
            </div>
          ) : (
            spaces.map(space => {
              const spacePlants = plants.filter(p => p.growSpaceId === space.id);
              return (
                <div 
                  key={space.id} 
                  onClick={() => navigate('/grows')}
                  className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{space.name}</h3>
                      <p className="text-xs text-slate-500">{space.dimensions} • {space.lightPower}W {space.lightType}</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded uppercase">
                      {spacePlants.length} Plantas
                    </span>
                  </div>
                  
                  <div className="flex -space-x-2">
                    {spacePlants.length > 0 ? spacePlants.map(p => (
                      <div key={p.id} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://picsum.photos/seed/${p.id}/100/100`} alt={p.name} />
                      </div>
                    )) : <p className="text-xs text-slate-500 italic">Espaço vazio</p>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Plantas Ativas</h2>
          <button 
            onClick={() => setShowAddPlant(true)}
            className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {plants.length === 0 ? (
            <p className="text-center py-10 text-slate-600">Nenhuma planta cadastrada ainda.</p>
          ) : (
            plants.map(plant => (
              <div 
                key={plant.id}
                onClick={() => navigate(`/plant/${plant.id}`)}
                className="flex items-center bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-700 mr-4 shrink-0 border border-slate-600">
                  <img src={`https://picsum.photos/seed/${plant.id}/200/200`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold truncate group-hover:text-emerald-400">{plant.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-700 rounded-full font-semibold uppercase text-slate-400">
                      {translateStage(plant.currentStage)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{plant.strain}</p>
                  <div className="mt-2 w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${getStageProgress(plant.currentStage)}`}></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modal de Adicionar Planta */}
      {showAddPlant && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-md rounded-t-3xl border-x border-t border-slate-700 p-6 animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Nova Planta</h3>
              <button onClick={() => setShowAddPlant(false)} className="p-2 text-slate-500"><XMarkIcon className="w-6 h-6"/></button>
            </div>
            <form onSubmit={handleAddPlant} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Nome da Planta</label>
                <input 
                  autoFocus
                  required
                  value={newPlant.name}
                  onChange={e => setNewPlant({...newPlant, name: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none" 
                  placeholder="Ex: Hulkberry #01"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Strain</label>
                  <input 
                    value={newPlant.strain}
                    onChange={e => setNewPlant({...newPlant, strain: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none" 
                    placeholder="Nome da Cepa"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Genética</label>
                  <select 
                    value={newPlant.genetics}
                    onChange={e => setNewPlant({...newPlant, genetics: e.target.value as Genetics})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none"
                  >
                    <option value={Genetics.PHOTO}>Fotoperíodo</option>
                    <option value={Genetics.AUTO}>Automática</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Espaço de Cultivo</label>
                <select 
                  required
                  value={newPlant.growSpaceId}
                  onChange={e => setNewPlant({...newPlant, growSpaceId: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none"
                >
                  <option value="">Selecione um Grow</option>
                  {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-emerald-500 text-slate-900 font-bold py-4 rounded-2xl mt-4 hover:bg-emerald-400 transition-colors">
                Salvar Planta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
