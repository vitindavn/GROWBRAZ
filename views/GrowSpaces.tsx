
import React, { useState } from 'react';
import { GrowSpace } from '../types';
import { PlusIcon, CubeIcon, BoltIcon, ArrowsPointingOutIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface GrowSpacesProps {
  spaces: GrowSpace[];
  setSpaces: React.Dispatch<React.SetStateAction<GrowSpace[]>>;
}

const GrowSpaces: React.FC<GrowSpacesProps> = ({ spaces, setSpaces }) => {
  const [showAddSpace, setShowAddSpace] = useState(false);
  const [newSpace, setNewSpace] = useState({
    name: '',
    dimensions: '',
    lightType: 'LED',
    lightPower: 0
  });

  const handleAddSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpace.name) return;

    const space: GrowSpace = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSpace.name,
      dimensions: newSpace.dimensions || 'N/A',
      lightType: newSpace.lightType,
      lightPower: newSpace.lightPower
    };

    setSpaces([...spaces, space]);
    setShowAddSpace(false);
    setNewSpace({ name: '', dimensions: '', lightType: 'LED', lightPower: 0 });
  };

  const removeSpace = (id: string) => {
    if (confirm('Deseja excluir este ambiente? Isso não removerá as plantas associadas, mas elas ficarão sem casa.')) {
      setSpaces(spaces.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ambientes</h2>
        <button 
          onClick={() => setShowAddSpace(true)}
          className="p-2 bg-emerald-500 text-slate-900 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {spaces.length === 0 ? (
          <div className="py-12 text-center text-slate-600">Você ainda não cadastrou nenhum grow.</div>
        ) : (
          spaces.map(space => (
            <div key={space.id} className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 shadow-lg group hover:border-emerald-500/50 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                    <CubeIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{space.name}</h3>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Indoor Setup</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeSpace(space.id)}
                  className="p-1 text-slate-600 hover:text-red-400 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
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
            </div>
          ))
        )}
      </div>

      <button 
        onClick={() => setShowAddSpace(true)}
        className="w-full p-8 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600 hover:border-emerald-500/30 hover:text-emerald-500/60 transition-all active:scale-95"
      >
        <PlusIcon className="w-12 h-12 mb-3 opacity-20" />
        <p className="text-sm font-bold uppercase tracking-widest">Novo Ambiente</p>
      </button>

      {/* Modal de Adicionar Espaço */}
      {showAddSpace && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-md rounded-t-3xl border-x border-t border-slate-700 p-6 animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-emerald-400">Novo Espaço</h3>
              <button onClick={() => setShowAddSpace(false)} className="p-2 text-slate-500 hover:text-slate-100 transition-colors"><XMarkIcon className="w-6 h-6"/></button>
            </div>
            <form onSubmit={handleAddSpace} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Nome do Grow</label>
                <input 
                  autoFocus
                  required
                  value={newSpace.name}
                  onChange={e => setNewSpace({...newSpace, name: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none" 
                  placeholder="Ex: Tenda Vegetativo"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Dimensões (cm)</label>
                <input 
                  value={newSpace.dimensions}
                  onChange={e => setNewSpace({...newSpace, dimensions: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none" 
                  placeholder="Ex: 80x80x160"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Tipo de Luz</label>
                  <select 
                    value={newSpace.lightType}
                    onChange={e => setNewSpace({...newSpace, lightType: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none"
                  >
                    <option value="LED">LED</option>
                    <option value="HPS">HPS</option>
                    <option value="QB">Quantum Board</option>
                    <option value="COB">COB LED</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Potência (W)</label>
                  <input 
                    type="number"
                    value={newSpace.lightPower}
                    onChange={e => setNewSpace({...newSpace, lightPower: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none" 
                    placeholder="240"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-500 text-slate-900 font-bold py-4 rounded-2xl mt-4 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/10">
                Cadastrar Ambiente
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowSpaces;
