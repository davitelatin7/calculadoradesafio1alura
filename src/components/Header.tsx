import React from 'react';
import { Plus, BookOpen, Download, Upload } from 'lucide-react';

interface HeaderProps {
  onOpenNewGoal: () => void;
  onExport: () => void;
  onImportClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewGoal,
  onExport,
  onImportClick,
}) => {
  return (
    <header className="border-b border-stone-200/80 bg-white sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark & brand name */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
            <BookOpen className="w-5 h-5 text-teal-100" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-stone-900 leading-tight">
              AdaptStudy
            </span>
            <span className="text-xs text-stone-700 hidden sm:inline leading-tight">
              Cadência flexível para seus estudos
            </span>
          </div>
        </div>

        {/* Zone 2: Informative note or subtle backup tools */}
        <div className="hidden md:flex items-center gap-2 text-xs text-stone-700">
          <span className="bg-stone-100 px-2.5 py-1 rounded-md text-stone-700 border border-stone-200">
            Armazenamento seguro local (neste navegador)
          </span>
          <button
            onClick={onExport}
            title="Exportar backup dos objetivos em arquivo JSON"
            className="flex items-center gap-1.5 px-2.5 py-1 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup</span>
          </button>
          <button
            onClick={onImportClick}
            title="Restaurar objetivos de arquivo JSON"
            className="flex items-center gap-1.5 px-2.5 py-1 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Restaurar</span>
          </button>
        </div>

        {/* Zone 3: Primary CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile backup buttons */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={onExport}
              title="Backup JSON"
              aria-label="Exportar backup"
              className="p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onImportClick}
              title="Restaurar backup"
              aria-label="Restaurar backup"
              className="p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewGoal}
            className="flex items-center gap-2 px-4 py-2 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Novo objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
