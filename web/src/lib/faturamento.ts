export type FaturamentoMes = {
  /** Fiscal month, YYYY-MM. */
  mes: string;
  quantidadeNotas: number;
  valorTotal: string;
};

export type FaturamentoMensal = {
  ano: number;
  meses: FaturamentoMes[];
};

export type ClienteFaturado = {
  cnpj: string;
  razaoSocial: string;
  quantidadeNotas: number;
  valorTotal: string;
  comentarioContador: string | null;
};

export type FaturamentoClientes = {
  mes: string;
  clientes: ClienteFaturado[];
};

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatBRL(value: number): string {
  return BRL.format(value);
}

// The month is built in UTC and formatted in UTC, so the browser's timezone never shifts it.
const MONTH = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** "2026-11" -> "novembro de 2026". */
export function formatMes(mes: string): string {
  const [year, month] = mes.split('-').map(Number);
  return MONTH.format(new Date(Date.UTC(year, month - 1, 1)));
}
