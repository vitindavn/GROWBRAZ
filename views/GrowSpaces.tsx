
import React from 'react';
import { GrowSpace } from '../types';
import { PlusIcon, CubeIcon, BoltIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';

interface GrowSpacesProps {
  spaces: GrowSpace[];
  setSpaces: React.Dispatch<React.SetStateAction<GrowSpace[]>>;
}

const GrowSpaces: React.FC<GrowSpacesProps> = ({ spaces }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ambientes de Cultivo</h2>
        <button className="p-2 bg-emerald-500 text-slate-900 rounded-xl">
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {spaces.map(space => (
          <div key={space.id} className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-lg group hover:border-emerald-500/50 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                  <CubeIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{space.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">Ambiente Indoor</span>
                </div>
              </div>
              <button className="text-slate-500 hover:text-slate-200">
                <PlusIcon className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-slate-300">
                <ArrowsPointingOutIcon className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Dimensões</p>
                  <p className="text-sm font-bold">{space.dimensions}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <BoltIcon className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Iluminação</p>
                  <p className="text-sm font-bold">{space.lightPower}W {space.lightType}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/50 flex justify-between items-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800"></div>
                <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-800"></div>
                <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold">+2</div>
              </div>
              <button className="text-emerald-400 text-sm font-bold">Gerenciar Espaço</button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500">
        <PlusIcon className="w-12 h-12 mb-3 opacity-20" />
        <p className="text-sm font-medium">Adicionar novo ambiente</p>
      </div>
    </div>
  );
};

export default GrowSpaces;
