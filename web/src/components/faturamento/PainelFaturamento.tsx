'use client';

import { useEffect, useId, useState } from 'react';
import { formatBRL, formatMes } from '@/lib/faturamento';
import { ClientesDoMes } from './ClientesDoMes';
import { useFaturamentoMensal } from './use-faturamento';

const REFRESH_MS = 60_000;
const PRIMEIRO_ANO = 2024;

export function PainelFaturamento() {
  const id = useId();
  const anoAtual = new Date().getFullYear();
  const [ano, setAno] = useState(anoAtual);
  const [mes, setMes] = useState<string | null>(null);
  const [autoAtualizar, setAutoAtualizar] = useState(false);
  const { dados, erro, carregando, recarregar } = useFaturamentoMensal(ano);

  useEffect(() => {
    if (!autoAtualizar) return;
    setInterval(recarregar, REFRESH_MS);
  }, [autoAtualizar, recarregar]);

  const anos = Array.from({ length: anoAtual - PRIMEIRO_ANO + 1 }, (_, i) => anoAtual - i);
  const meses = dados?.meses ?? [];
  const totalAno = meses.reduce((soma, m) => soma + parseFloat(m.valorTotal), 0);
  const notasAno = meses.reduce((soma, m) => soma + m.quantidadeNotas, 0);
  const maiorMes = Math.max(...meses.map((m) => parseFloat(m.valorTotal)), 1);

  return (
    <div className="faturamento">
      <div className="faturamento__filtros">
        <label htmlFor={`${id}-ano`}>Ano</label>
        <select
          id={`${id}-ano`}
          value={ano}
          onChange={(event) => {
            setAno(Number(event.target.value));
            setMes(null);
          }}
        >
          {anos.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={autoAtualizar}
            onChange={(event) => setAutoAtualizar(event.target.checked)}
          />
          Atualizar a cada minuto
        </label>
      </div>

      {erro && <p role="alert">{erro}</p>}
      {carregando && <p role="status">Carregando faturamento…</p>}

      {dados && (
        <>
          <dl className="faturamento__resumo">
            <div>
              <dt>Faturado em {ano}</dt>
              <dd>{formatBRL(totalAno)}</dd>
            </div>
            <div>
              <dt>Notas autorizadas</dt>
              <dd>{notasAno}</dd>
            </div>
            <div>
              <dt>Ticket médio</dt>
              <dd>{notasAno > 0 ? formatBRL(totalAno / notasAno) : '—'}</dd>
            </div>
          </dl>

          <div className="faturamento__meses">
            {meses.map((m) => (
              <div
                key={m.mes}
                className={m.mes === mes ? 'mes mes--selecionado' : 'mes'}
                onClick={() => setMes(m.mes)}
              >
                <span className="mes__nome">{formatMes(m.mes)}</span>
                <span className="mes__barra" style={{ width: `${(parseFloat(m.valorTotal) / maiorMes) * 100}%` }} />
                <span className="mes__valor">{formatBRL(parseFloat(m.valorTotal))}</span>
                <span className="mes__notas">{m.quantidadeNotas} notas</span>
              </div>
            ))}
          </div>
        </>
      )}

      {mes && <ClientesDoMes mes={mes} />}
    </div>
  );
}
