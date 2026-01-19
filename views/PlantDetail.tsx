
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plant, GrowStage, LogType, MaintenanceLog, TrainingType } from '../types';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  BeakerIcon, 
  ScissorsIcon, 
  PlusIcon,
  CameraIcon
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

  if (!plant) return <div className="p-10 text-center">Planta não encontrada</div>;

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
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-full text-slate-300">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold truncate">{plant.name}</h2>
      </div>

      <div className="relative rounded-3xl overflow-hidden aspect-video mb-6 border border-slate-700">
        <img src={`https://picsum.photos/seed/${plant.id}/800/400`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent flex items-end p-6">
          <div>
            <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest">{plant.strain}</p>
            <h3 className="text-3xl font-black">{translateStage(plant.currentStage)}</h3>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-800/50 p-1 rounded-2xl mb-8 border border-slate-700">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'info' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Informações
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'logs' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Registros
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
            activeTab === 'gallery' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Galeria
        </button>
      </div>

      {activeTab === 'info' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InfoCard label="Genética" value={plant.genetics} />
            <InfoCard label="Banco de Sementes" value={plant.seedBank} />
            <InfoCard label="Idade" value={`${Math.floor((Date.now() - plant.startDate) / (24*60*60*1000))} Dias`} />
            <InfoCard label="Espaço" value={spaces.find(s => s.id === plant.growSpaceId)?.name || 'Desconhecido'} />
          </div>

          <div className="p-6 bg-slate-800/40 rounded-2xl border border-slate-700">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-400" />
              Linha do Tempo
            </h4>
            <div className="space-y-4">
              <TimelineItem stage="Germinação" date="12 Out" completed />
              <TimelineItem stage="Plântula" date="18 Out" completed />
              <TimelineItem stage="Vegetativo" date="02 Nov" current />
              <TimelineItem stage="Floração" date="Prev. 15 Dez" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-4 pb-12">
           <div className="grid grid-cols-3 gap-2 mb-4">
             <LogActionBtn icon={<BeakerIcon className="w-6 h-6"/>} label="Regar" color="bg-cyan-500" />
             <LogActionBtn icon={<ScissorsIcon className="w-6 h-6"/>} label="Treino" color="bg-orange-500" />
             <LogActionBtn icon={<CameraIcon className="w-6 h-6"/>} label="Foto" color="bg-purple-500" />
           </div>

           <div className="space-y-3">
              <LogItem date="Hoje, 10:30 AM" type={LogType.WATERING} ph={6.2} ec={1.4} volume={1.5} />
              <LogItem date="Ontem" type={LogType.TRAINING} training={[TrainingType.LST, TrainingType.DEFOLIATION]} />
              <LogItem date="28 Nov" type={LogType.WATERING} ph={6.4} ec={1.2} volume={1.0} />
           </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="grid grid-cols-2 gap-3 pb-12">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
              <img src={`https://picsum.photos/seed/p${i}${plant.id}/300/300`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          ))}
          <button className="aspect-square border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:border-emerald-500/50 hover:text-emerald-500 transition-all">
            <PlusIcon className="w-8 h-8 mb-1" />
            <span className="text-xs font-bold uppercase">Adicionar</span>
          </button>
        </div>
      )}
    </div>
  );
};

const InfoCard: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
    <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider mb-1">{label}</p>
    <p className="font-bold text-slate-100 truncate">{value}</p>
  </div>
);

const TimelineItem: React.FC<{ stage: string, date: string, completed?: boolean, current?: boolean }> = ({ stage, date, completed, current }) => (
  <div className="flex items-center gap-4">
    <div className={`w-3 h-3 rounded-full ${completed ? 'bg-emerald-500' : current ? 'bg-cyan-500 animate-pulse' : 'bg-slate-700'}`}></div>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <span className={`text-sm font-bold ${current ? 'text-slate-100' : 'text-slate-400'}`}>{stage}</span>
        <span className="text-[10px] text-slate-500">{date}</span>
      </div>
    </div>
  </div>
);

const LogActionBtn: React.FC<{ icon: React.ReactNode, label: string, color: string }> = ({ icon, label, color }) => (
  <button className={`flex flex-col items-center justify-center p-4 ${color} text-slate-900 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-${color.split('-')[1]}-500/20`}>
    {icon}
    <span className="text-[10px] font-black uppercase mt-1">{label}</span>
  </button>
);

const LogItem: React.FC<{ date: string, type: LogType, ph?: number, ec?: number, volume?: number, training?: TrainingType[] }> = ({ date, type, ph, ec, volume, training }) => (
  <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700 flex items-start gap-4">
    <div className={`p-2 rounded-xl ${type === LogType.WATERING ? 'bg-cyan-500/10 text-cyan-400' : 'bg-orange-500/10 text-orange-400'}`}>
      {type === LogType.WATERING ? <BeakerIcon className="w-5 h-5"/> : <ScissorsIcon className="w-5 h-5"/>}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start mb-1">
        <h5 className="text-sm font-bold text-slate-200">{type === LogType.WATERING ? 'Rega' : type === LogType.TRAINING ? 'Treino' : type}</h5>
        <span className="text-[10px] text-slate-500">{date}</span>
      </div>
      {type === LogType.WATERING ? (
        <div className="flex gap-4 text-xs">
          <span className="text-slate-400">pH <b className="text-slate-200">{ph}</b></span>
          <span className="text-slate-400">EC <b className="text-slate-200">{ec}</b></span>
          <span className="text-slate-400">Vol <b className="text-slate-200">{volume}L</b></span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {training?.map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-700 rounded text-slate-300 font-medium">{t}</span>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default PlantDetail;
