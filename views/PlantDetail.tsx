
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plant, GrowStage, LogType, MaintenanceLog, TrainingType } from '../types';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  BeakerIcon, 
  ScissorsIcon, 
  PlusIcon,
  CameraIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface PlantDetailProps {
  plants: Plant[];
  setPlants: React.Dispatch<React.SetStateAction<Plant[]>>;
  spaces: any[];
}

const PlantDetail: React.FC<PlantDetailProps> = ({ plants, setPlants, spaces }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const plant = plants.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState<'info' | 'logs' | 'gallery'>('info');
  const [showLogModal, setShowLogModal] = useState<LogType | null>(null);

  // Form State para Rega
  const [wateringForm, setWateringForm] = useState({ ph: 6.2, ec: 1.2, vol: 1.0 });

  if (!plant) return <div className="p-10 text-center">Planta não encontrada</div>;

  const handleAddLog = (type: LogType, data: any = {}) => {
    const newLog: MaintenanceLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: Date.now(),
      type,
      ...data
    };

    const updatedPlants = plants.map(p => {
      if (p.id === plant.id) {
        return { ...p, logs: [newLog, ...(p.logs || [])] };
      }
      return p;
    });

    setPlants(updatedPlants);
    setShowLogModal(null);
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
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-full text-slate-300 hover:bg-slate-700 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold truncate flex-1">{plant.name}</h2>
      </div>

      <div className="relative rounded-3xl overflow-hidden aspect-video mb-6 border border-slate-700 shadow-2xl shadow-emerald-500/5 group">
        <img src={`https://picsum.photos/seed/${plant.id}/800/400`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/20 to-transparent flex items-end p-6">
          <div>
            <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-1">{plant.strain}</p>
            <h3 className="text-3xl font-black text-white">{translateStage(plant.currentStage)}</h3>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-800/50 p-1.5 rounded-2xl mb-8 border border-slate-700 sticky top-20 z-20 backdrop-blur-lg">
        {(['info', 'logs', 'gallery'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
              activeTab === tab ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            {tab === 'info' ? 'Info' : tab === 'logs' ? 'Diário' : 'Galeria'}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <div className="space-y-6 animate-in slide-in-from-left-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="Genética" value={plant.genetics} />
            <InfoCard label="Seed Bank" value={plant.seedBank} />
            <InfoCard label="Tempo Total" value={`${Math.floor((Date.now() - plant.startDate) / (24*60*60*1000))} Dias`} />
            <InfoCard label="Ambiente" value={spaces.find(s => s.id === plant.growSpaceId)?.name || 'N/A'} />
          </div>

          <div className="p-6 bg-slate-800/40 rounded-3xl border border-slate-700/50">
            <h4 className="font-bold mb-5 flex items-center gap-2 text-slate-200">
              <CalendarIcon className="w-5 h-5 text-emerald-400" />
              Progressão do Ciclo
            </h4>
            <div className="space-y-5 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-700">
              <TimelineItem stage="Germinação" date="Início" completed />
              <TimelineItem stage="Ciclo Atual" date="Ativo" current />
              <TimelineItem stage="Floração / Colheita" date="Próximo" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
           <div className="grid grid-cols-3 gap-3">
             <LogActionBtn icon={<BeakerIcon className="w-6 h-6"/>} label="Regar" color="bg-cyan-500" onClick={() => setShowLogModal(LogType.WATERING)} />
             <LogActionBtn icon={<ScissorsIcon className="w-6 h-6"/>} label="Treino" color="bg-orange-500" onClick={() => handleAddLog(LogType.TRAINING, { trainingTypes: [TrainingType.LST] })} />
             <LogActionBtn icon={<CameraIcon className="w-6 h-6"/>} label="Foto" color="bg-purple-500" onClick={() => handleAddLog(LogType.PHOTO)} />
           </div>

           <div className="space-y-4">
              {(!plant.logs || plant.logs.length === 0) ? (
                <div className="text-center py-12 text-slate-600 italic text-sm">Nenhum registro encontrado para esta planta.</div>
              ) : (
                plant.logs.map(log => (
                  <LogItem 
                    key={log.id} 
                    date={new Date(log.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'})} 
                    type={log.type} 
                    ph={log.ph} 
                    ec={log.ecPpm} 
                    volume={log.volumeLiters} 
                    training={log.trainingTypes} 
                  />
                ))
              )}
           </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="grid grid-cols-2 gap-3 animate-in fade-in">
          {[1,2,3,4].map(i => (
            <div key={i} className="aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50">
              <img src={`https://picsum.photos/seed/p${i}${plant.id}/300/300`} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
            </div>
          ))}
          <button className="aspect-square border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-700 hover:border-emerald-500/30 hover:text-emerald-500 transition-all active:scale-95">
            <PlusIcon className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-black uppercase tracking-wider">Nova Foto</span>
          </button>
        </div>
      )}

      {/* Modal de Rega */}
      {showLogModal === LogType.WATERING && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 w-full max-w-md rounded-t-3xl border-x border-t border-slate-700 p-6 animate-in slide-in-from-bottom-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                <BeakerIcon className="w-6 h-6"/> Registrar Rega
              </h3>
              <button onClick={() => setShowLogModal(null)} className="p-2 text-slate-500"><XMarkIcon className="w-6 h-6"/></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <LogInput label="pH" value={wateringForm.ph} onChange={v => setWateringForm({...wateringForm, ph: v})} />
                <LogInput label="EC" value={wateringForm.ec} onChange={v => setWateringForm({...wateringForm, ec: v})} />
                <LogInput label="Vol (L)" value={wateringForm.vol} onChange={v => setWateringForm({...wateringForm, vol: v})} />
              </div>
              <button 
                onClick={() => handleAddLog(LogType.WATERING, { ph: wateringForm.ph, ecPpm: wateringForm.ec, volumeLiters: wateringForm.vol })}
                className="w-full bg-cyan-500 text-slate-900 font-bold py-4 rounded-2xl mt-4 flex items-center justify-center gap-2"
              >
                <CheckIcon className="w-5 h-5"/> Salvar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
    <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider mb-1">{label}</p>
    <p className="font-bold text-slate-100 truncate text-sm">{value}</p>
  </div>
);

const TimelineItem: React.FC<{ stage: string, date: string, completed?: boolean, current?: boolean }> = ({ stage, date, completed, current }) => (
  <div className="flex items-center gap-4 relative z-10">
    <div className={`w-3 h-3 rounded-full border-2 ${completed ? 'bg-emerald-500 border-emerald-500' : current ? 'bg-cyan-500 border-cyan-400 animate-pulse' : 'bg-slate-900 border-slate-700'}`}></div>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <span className={`text-sm font-bold ${current ? 'text-slate-100' : 'text-slate-500'}`}>{stage}</span>
        <span className="text-[10px] text-slate-600 font-medium">{date}</span>
      </div>
    </div>
  </div>
);

const LogActionBtn: React.FC<{ icon: React.ReactNode, label: string, color: string, onClick?: () => void }> = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center p-5 ${color} text-slate-950 rounded-3xl hover:opacity-90 active:scale-90 transition-all shadow-xl shadow-${color.split('-')[1]}-500/10`}>
    {icon}
    <span className="text-[10px] font-black uppercase mt-2 tracking-widest">{label}</span>
  </button>
);

const LogInput: React.FC<{ label: string, value: number, onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div>
    <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">{label}</label>
    <input 
      type="number" 
      step="0.1"
      value={value}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-3 text-center text-slate-100 font-bold focus:border-emerald-500 outline-none"
    />
  </div>
);

const LogItem: React.FC<{ date: string, type: LogType, ph?: number, ec?: number, volume?: number, training?: TrainingType[] }> = ({ date, type, ph, ec, volume, training }) => (
  <div className="p-5 bg-slate-800/40 rounded-3xl border border-slate-700/50 flex items-start gap-5 hover:bg-slate-800/60 transition-colors">
    <div className={`p-3 rounded-2xl ${
      type === LogType.WATERING ? 'bg-cyan-500/10 text-cyan-400' : 
      type === LogType.TRAINING ? 'bg-orange-500/10 text-orange-400' :
      'bg-purple-500/10 text-purple-400'
    }`}>
      {type === LogType.WATERING ? <BeakerIcon className="w-6 h-6"/> : type === LogType.TRAINING ? <ScissorsIcon className="w-6 h-6"/> : <CameraIcon className="w-6 h-6"/>}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start mb-2">
        <h5 className="text-sm font-black text-slate-200 uppercase tracking-wider">
          {type === LogType.WATERING ? 'Rega' : type === LogType.TRAINING ? 'Manutenção' : 'Foto'}
        </h5>
        <span className="text-[10px] text-slate-600 font-bold">{date}</span>
      </div>
      {type === LogType.WATERING ? (
        <div className="flex gap-4">
          <LogBadge label="pH" value={ph} />
          <LogBadge label="EC" value={ec} />
          <LogBadge label="Vol" value={`${volume}L`} />
        </div>
      ) : type === LogType.TRAINING ? (
        <div className="flex flex-wrap gap-2">
          {training?.map(t => (
            <span key={t} className="text-[10px] px-2.5 py-1 bg-slate-700/50 rounded-lg text-slate-400 font-bold uppercase tracking-tighter border border-slate-600/30">{t}</span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 font-medium italic">Novo registro visual adicionado.</p>
      )}
    </div>
  </div>
);

const LogBadge: React.FC<{ label: string, value: any }> = ({ label, value }) => (
  <div className="text-[10px] font-bold">
    <span className="text-slate-600 uppercase mr-1">{label}</span>
    <span className="text-slate-300">{value}</span>
  </div>
);

export default PlantDetail;
