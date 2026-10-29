import { Operation } from '../types/calculator';

export interface PythonExecutionDetail {
  functionDef: string;
  variableAssignments: string;
  executionCall: string;
  fullSnippet: string;
  terminalOutput: string;
  pedagogicalTip: string;
  operationName: string;
  conceptTitle: string;
  conceptExplanation: string;
}

export function getPythonExecutionDetail(
  operand1: number | null,
  operation: Operation,
  operand2: number | null,
  result: number | string | null,
  isDivisionByZero: boolean = false
): PythonExecutionDetail {
  if (operand1 === null || operation === null) {
    return {
      functionDef: `# As 4 funções básicas em Python:
def somar(a, b):
    return a + b

def subtrair(a, b):
    return a - b

def multiplicar(a, b):
    return a * b

def dividir(a, b):
    if b == 0:
        return "Erro: Divisão por zero!"
    return a / b`,
      variableAssignments: `# Aguardando operação...
# Digite os números e selecione a operação na calculadora.`,
      executionCall: `# Nenhuma chamada ativa ainda`,
      fullSnippet: `# Código Python pronto para executar
def somar(a, b): return a + b
def subtrair(a, b): return a - b
def multiplicar(a, b): return a * b
def dividir(a, b): return "Erro" if b == 0 else a / b`,
      terminalOutput: `>>> # Pronto para calcular`,
      pedagogicalTip: 'Em Python, usamos a palavra-chave "def" para criar funções. Elas recebem parâmetros (entradas) e usam "return" para devolver a resposta.',
      operationName: 'Aguardando Operação',
      conceptTitle: 'Funções em Python (def)',
      conceptExplanation: 'Funções são blocos de código reaproveitáveis. Ao invés de repetir a fórmula em vários lugares, você define uma função uma vez e pode chamá-la quantas vezes quiser.',
    };
  }

  const opSymbols = {
    add: '+',
    subtract: '-',
    multiply: '*',
    divide: '/',
  };

  const opNames = {
    add: 'Adição',
    subtract: 'Subtração',
    multiply: 'Multiplicação',
    divide: 'Divisão',
  };

  const opFuncNames = {
    add: 'somar',
    subtract: 'subtrair',
    multiply: 'multiplicar',
    divide: 'dividir',
  };

  const funcName = opFuncNames[operation];
  const symbol = opSymbols[operation];
  const opTitle = opNames[operation];

  const valA = operand1;
  const valB = operand2 !== null ? operand2 : 0;

  // Division by zero special handling
  if (operation === 'divide' && (valB === 0 || isDivisionByZero)) {
    const code = `def dividir(a: float, b: float):
    # Proteção: verificar se o denominador é zero
    if b == 0:
        return "Erro: Não é possível dividir por zero!"
    return a / b

# Entrada dos dados:
numero1 = ${valA}
numero2 = 0.0

resultado = dividir(numero1, numero2)
print(resultado)`;

    return {
      functionDef: `def dividir(a, b):
    if b == 0:
        return "Erro: Não é possível dividir por zero!"
    return a / b`,
      variableAssignments: `numero1 = ${valA}
numero2 = 0.0`,
      executionCall: `resultado = dividir(numero1, numero2)`,
      fullSnippet: code,
      terminalOutput: `>>> numero1 = ${valA}
>>> numero2 = 0.0
>>> dividir(numero1, numero2)
'Erro: Não é possível dividir por zero!'`,
      pedagogicalTip: 'Cuidado! Se você não colocar a verificação "if b == 0", o Python interrompe o programa com o erro ZeroDivisionError.',
      operationName: 'Divisão por Zero',
      conceptTitle: 'Tratamento de Exceções e Condicionais',
      conceptExplanation: 'Na matemática e na computação, dividir por zero é impossível. Em Python, usamos a estrutura "if b == 0" para interceptar esse caso antes que o interpretador dispare um erro crítico.',
    };
  }

  // Normal calculation
  const resValue = result !== null ? result : (
    operation === 'add' ? valA + valB :
    operation === 'subtract' ? valA - valB :
    operation === 'multiply' ? valA * valB :
    valB !== 0 ? valA / valB : 0
  );

  const formattedResult = typeof resValue === 'number' 
    ? (Number.isInteger(resValue) ? `${resValue}.0` : resValue.toString())
    : resValue;

  const funcDef = operation === 'divide' ? `def dividir(a, b):
    if b == 0:
        return "Erro: Não é possível dividir por zero!"
    return a / b` : `def ${funcName}(a, b):
    return a ${symbol} b`;

  const assignments = `numero1 = ${valA}   # tipo: float
numero2 = ${valB}   # tipo: float`;

  const call = `resultado = ${funcName}(numero1, numero2)
print(f"Resultado: {numero1} ${symbol} {numero2} = {resultado}")`;

  const fullCode = `# 1. Definindo a função matemática
${funcDef}

# 2. Convertendo as entradas do usuário para float (números com casas decimais)
numero1 = float("${valA}")
numero2 = float("${valB}")

# 3. Chamando a função e exibindo o resultado
resultado = ${funcName}(numero1, numero2)
print(f"{numero1} ${symbol} {numero2} = {resultado}")  # Saída: ${formattedResult}`;

  const terminalOutput = `>>> numero1 = ${valA}
>>> numero2 = ${valB}
>>> ${funcName}(numero1, numero2)
${formattedResult}`;

  const tips: Record<string, string> = {
    add: 'A adição em Python usa o operador "+". Com números ele soma valores, mas atenção: com textos (strings) ele junta as palavras (concatenação)!',
    subtract: 'A subtração usa o operador "-". O Python lida nativamente com números negativos (ex: 5 - 10 = -5.0).',
    multiply: 'A multiplicação usa o asterisco "*". Em Python, se você usar dois asteriscos "**", você faz potenciação (ex: 2 ** 3 = 8).',
    divide: 'A barra "/" em Python sempre retorna um número decimal (float), mesmo que a divisão seja exata (ex: 10 / 2 = 5.0). Para divisão inteira, usa-se "//".',
  };

  return {
    functionDef: funcDef,
    variableAssignments: assignments,
    executionCall: call,
    fullSnippet: fullCode,
    terminalOutput,
    pedagogicalTip: tips[operation] || 'Pratique alterando os números e observando o comportamento das variáveis.',
    operationName: opTitle,
    conceptTitle: `Operação de ${opTitle}`,
    conceptExplanation: `Ao executar esta operação, o interpretador Python armazena os valores nas variáveis locais 'a' e 'b', calcula a expressão matemática 'a ${symbol} b' e retorna o resultado para o chamador.`,
  };
}

export const COMPLETE_PYTHON_SCRIPT = `# =======================================================
# CALCULADORA BÁSICA EM PYTHON PARA INICIANTES
# Aprenda: Funções, Conversão de Tipos e Condicionais
# =======================================================

# 1. FUNÇÕES DAS 4 OPERAÇÕES BÁSICAS
def somar(a, b):
    """Retorna a soma de dois números."""
    return a + b

def subtrair(a, b):
    """Retorna a subtração entre dois números."""
    return a - b

def multiplicar(a, b):
    """Retorna o produto da multiplicação de dois números."""
    return a * b

def dividir(a, b):
    """Retorna a divisão. Protegido contra divisão por zero!"""
    if b == 0:
        return "Erro: Não é possível dividir por zero!"
    return a / b

# 2. FUNÇÃO PRINCIPAL DO PROGRAMA
def calculadora():
    print("=" * 35)
    print("   CALCULADORA DIDÁTICA EM PYTHON")
    print("=" * 35)
    print("Operações disponíveis:")
    print("  1 -> Adição (+)")
    print("  2 -> Subtração (-)")
    print("  3 -> Multiplicação (*)")
    print("  4 -> Divisão (/)")
    print("  0 -> Sair do programa")
    print("-" * 35)

    opcao = input("Escolha uma opção (0 a 4): ")

    if opcao == '0':
        print("Até logo! Bons estudos em Python!")
        return

    if opcao not in ['1', '2', '3', '4']:
        print("Opção inválida! Escolha um número de 1 a 4.")
        return

    # Entrada de números com tratamento de erro
    try:
        num1 = float(input("Digite o primeiro número: "))
        num2 = float(input("Digite o segundo número: "))
    except ValueError:
        print("Erro: Digite apenas números válidos!")
        return

    # Execução baseada na escolha do usuário
    if opcao == '1':
        res = somar(num1, num2)
        print(f"\\nResultado: {num1} + {num2} = {res}")
    elif opcao == '2':
        res = subtrair(num1, num2)
        print(f"\\nResultado: {num1} - {num2} = {res}")
    elif opcao == '3':
        res = multiplicar(num1, num2)
        print(f"\\nResultado: {num1} * {num2} = {res}")
    elif opcao == '4':
        res = dividir(num1, num2)
        print(f"\\nResultado: {num1} / {num2} = {res}")

if __name__ == "__main__":
    calculadora()
`;
