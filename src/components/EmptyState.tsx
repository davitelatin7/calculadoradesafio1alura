import React from 'react';
import { Sparkles, Plus, TestTube2, Compass } from 'lucide-react';

interface EmptyStateProps {
  onOpenNewGoal: () => void;
  onLoadDemoData: () => void;
  isFiltered?: boolean;
  onClearFilter?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onOpenNewGoal,
  onLoadDemoData,
  isFiltered = false,
  onClearFilter,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white border border-stone-200/90 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-2xs">
        <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-500 mx-auto flex items-center justify-center mb-4">
          <Compass className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900 mb-1.5">
          Nenhum objetivo encontrado com esses filtros
        </h3>
        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
          Tente ajustar os termos da busca ou mudar o status selecionado.
        </p>
        {onClearFilter && (
          <button
            onClick={onClearFilter}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Ver todos os objetivos
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200/90 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto my-6 shadow-2xs">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-800 border border-teal-100 mx-auto flex items-center justify-center mb-4">
        <Sparkles className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-stone-900 mb-2">
        Você ainda não tem objetivos de estudo
      </h3>

      <p className="text-xs text-stone-600 mb-6 max-w-md mx-auto leading-relaxed">
        Que tal começar definindo o que deseja aprender? Registre suas metas com prazos tranquilos,
        ajuste o ritmo quando precisar e acompanhe seu progresso sem cobranças excessivas.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenNewGoal}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar primeiro objetivo</span>
        </button>

        <button
          onClick={onLoadDemoData}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          title="Preenche a lista com metas de teste para demonstração rápida"
        >
          <TestTube2 className="w-3.5 h-3.5 text-stone-500" />
          <span>Carregar exemplos de teste</span>
        </button>
      </div>

      {/* Suggested categories info */}
      <div className="mt-8 pt-6 border-t border-stone-100 text-left">
        <span className="text-[11px] font-semibold text-stone-500 block mb-2">
          Exemplos do que você pode organizar no AdaptStudy:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-600">
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
            <span className="font-semibold text-stone-800 block mb-0.5">Vestibulares & ENEM</span>
            Revisão de matemática, redação, edital de concurso.
          </div>
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
            <span className="font-semibold text-stone-800 block mb-0.5">Acadêmico</span>
            Trabalhos de faculdade, artigos, preparação de provas.
          </div>
          <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100">
            <span className="font-semibold text-stone-800 block mb-0.5">Autodidata</span>
            Aprender inglês, cursos de programação, leitura técnica.
          </div>
        </div>
      </div>
    </div>
  );
};
