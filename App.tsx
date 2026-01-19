
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  PhotoIcon, 
  Cog6ToothIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import Dashboard from './views/Dashboard';
import GrowSpaces from './views/GrowSpaces';
import PlantDetail from './views/PlantDetail';
import { GrowSpace, Plant, Genetics, GrowStage } from './types';

const App: React.FC = () => {
  // Carregar dados iniciais do localStorage ou usar mock se vazio
  const [spaces, setSpaces] = useState<GrowSpace[]>(() => {
    const saved = localStorage.getItem('gb_spaces');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Grow Alpha', dimensions: '60x60x160', lightType: 'LED Full Spectrum', lightPower: 240 }
    ];
  });

  const [plants, setPlants] = useState<Plant[]>(() => {
    const saved = localStorage.getItem('gb_plants');
    return saved ? JSON.parse(saved) : [
      {
        id: 'p1',
        growSpaceId: '1',
        name: 'Glookies #1',
        strain: 'Glookies',
        genetics: Genetics.PHOTO,
        seedBank: 'Barney\'s Farm',
        startDate: Date.now() - (30 * 24 * 60 * 60 * 1000),
        currentStage: GrowStage.VEGETATIVE,
        logs: []
      }
    ];
  });

  // Persistir sempre que houver mudança
  useEffect(() => {
    localStorage.setItem('gb_spaces', JSON.stringify(spaces));
  }, [spaces]);

  useEffect(() => {
    localStorage.setItem('gb_plants', JSON.stringify(plants));
  }, [plants]);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col pb-20 max-w-md mx-auto shadow-2xl bg-slate-900 border-x border-slate-800">
        <header className="sticky top-0 z-30 px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-xl">G</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">GrowBraZ</h1>
          </div>
          <button className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-emerald-400 transition-colors">
            <Cog6ToothIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard plants={plants} setPlants={setPlants} spaces={spaces} />} />
            <Route path="/grows" element={<GrowSpaces spaces={spaces} setSpaces={setSpaces} />} />
            <Route path="/plant/:id" element={<PlantDetail plants={plants} setPlants={setPlants} spaces={spaces} />} />
            <Route path="/gallery" element={<div className="p-10 text-center text-slate-500">Galeria Visual em Breve</div>} />
          </Routes>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-6 py-3 flex justify-between items-center z-40 safe-bottom">
          <NavButton to="/" icon={<HomeIcon className="w-6 h-6" />} label="Início" />
          <NavButton to="/grows" icon={<ChartBarIcon className="w-6 h-6" />} label="Espaços" />
          <NavButton to="/gallery" icon={<PhotoIcon className="w-6 h-6" />} label="Galeria" />
          <button className="flex flex-col items-center space-y-1 text-slate-600 cursor-not-allowed">
            <Cog6ToothIcon className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Ajustes</span>
          </button>
        </nav>
      </div>
    </HashRouter>
  );
};

const NavButton: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => (
  <NavLink to={to} className={({ isActive }) => `flex flex-col items-center space-y-1 transition-all ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-500 hover:text-slate-300'}`}>
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </NavLink>
);

export default App;
