import React from 'react';
import { BookOpen, Layers, Type, GitFork, ShieldAlert, Zap } from 'lucide-react';

export const LearningGuide: React.FC = () => {
  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-stone-800">
        <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-stone-100">
            Guia Didático: Como a Calculadora Funciona em Python
          </h2>
          <p className="text-xs text-stone-400">
            Conceitos essenciais explicados passo a passo para iniciantes
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1 */}
        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs">
            <Layers className="w-4 h-4 text-teal-400" />
            <span>1. Funções com "def" e "return"</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Uma função é um bloco com nome que executa uma tarefa. No Python, usamos <code className="text-emerald-400 font-mono">def nome(parametros):</code> e entregamos o cálculo final usando <code className="text-emerald-400 font-mono">return</code>.
          </p>
          <div className="bg-black/80 rounded-lg p-2.5 font-mono text-[11px] text-stone-300">
            <span className="text-purple-400">def</span> <span className="text-emerald-400">somar</span>(a, b):<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> a + b
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
            <Type className="w-4 h-4 text-amber-400" />
            <span>2. Conversão de Tipos com "float()"</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            A função <code className="text-amber-300 font-mono">input()</code> sempre recebe texto (<code className="text-stone-400 font-mono">str</code>). Se somarmos <code className="text-stone-400 font-mono">"5" + "5"</code> o Python resulta em <code className="text-stone-400 font-mono">"55"</code>! Por isso convertemos para <code className="text-amber-300 font-mono">float()</code> (número decimal).
          </p>
          <div className="bg-black/80 rounded-lg p-2.5 font-mono text-[11px] text-stone-300">
            numero = <span className="text-amber-400">float</span>(input(<span className="text-emerald-300">"Digite: "</span>))
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
            <GitFork className="w-4 h-4 text-cyan-400" />
            <span>3. Decisão com "if / elif / else"</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Estruturas condicionais avaliam a opção escolhida pelo usuário para chamar a função correta da operação matemática.
          </p>
          <div className="bg-black/80 rounded-lg p-2.5 font-mono text-[11px] text-stone-300">
            <span className="text-purple-400">if</span> opcao == <span className="text-emerald-300">'1'</span>:<br />
            &nbsp;&nbsp;&nbsp;&nbsp;resultado = somar(num1, num2)<br />
            <span className="text-purple-400">elif</span> opcao == <span className="text-emerald-300">'2'</span>:<br />
            &nbsp;&nbsp;&nbsp;&nbsp;resultado = subtrair(num1, num2)
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>4. Tratamento de Divisão por Zero</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Dividir qualquer número por zero é matematicamente impossível. Em Python isso dispara um erro <code className="text-rose-400 font-mono">ZeroDivisionError</code>. Prevenimos isso verificando se o divisor é zero antes da conta.
          </p>
          <div className="bg-black/80 rounded-lg p-2.5 font-mono text-[11px] text-stone-300">
            <span className="text-purple-400">if</span> b == 0:<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-rose-300">"Não é possível dividir por 0"</span><br />
            <span className="text-purple-400">return</span> a / b
          </div>
        </div>
      </div>

      {/* Python Operators Quick Table */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-300 mb-3">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Tabela de Operadores Matemáticos em Python</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-300 border-collapse font-mono">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 text-[11px]">
                <th className="py-2 px-3">Operação</th>
                <th className="py-2 px-3">Símbolo Python</th>
                <th className="py-2 px-3">Exemplo</th>
                <th className="py-2 px-3">Resultado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-[11px]">
              <tr>
                <td className="py-2 px-3 font-sans text-stone-200">Adição</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">+</td>
                <td className="py-2 px-3">10 + 5</td>
                <td className="py-2 px-3 text-stone-400">15</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-stone-200">Subtração</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">-</td>
                <td className="py-2 px-3">20 - 8</td>
                <td className="py-2 px-3 text-stone-400">12</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-stone-200">Multiplicação</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">*</td>
                <td className="py-2 px-3">6 * 7</td>
                <td className="py-2 px-3 text-stone-400">42</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-stone-200">Divisão (com float)</td>
                <td className="py-2 px-3 text-emerald-400 font-bold">/</td>
                <td className="py-2 px-3">10 / 4</td>
                <td className="py-2 px-3 text-stone-400">2.5</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-stone-200">Divisão Inteira</td>
                <td className="py-2 px-3 text-cyan-400 font-bold">//</td>
                <td className="py-2 px-3">10 // 4</td>
                <td className="py-2 px-3 text-stone-400">2 (descarta a fração)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-stone-200">Módulo (Resto)</td>
                <td className="py-2 px-3 text-cyan-400 font-bold">%</td>
                <td className="py-2 px-3">10 % 3</td>
                <td className="py-2 px-3 text-stone-400">1 (resto da divisão)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-sans text-stone-200">Potenciação</td>
                <td className="py-2 px-3 text-cyan-400 font-bold">**</td>
                <td className="py-2 px-3">2 ** 3</td>
                <td className="py-2 px-3 text-stone-400">8 (2 elevado a 3)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
