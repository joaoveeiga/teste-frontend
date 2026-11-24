'use client';

import { useEffect, useMemo, useState } from 'react';
import { getJson } from '@/lib/api';
import { formatBRL, formatMes, type ClienteFaturado, type FaturamentoClientes } from '@/lib/faturamento';

type Ordem = 'valor' | 'nome';

async function buscarClientes(mes: string): Promise<ClienteFaturado[]> {
  try {
    const { clientes } = await getJson<FaturamentoClientes>(`/api/faturamento/clientes?mes=${mes}&limite=20`);
    return clientes;
  } catch {
    return [];
  }
}

export function ClientesDoMes({ mes }: { mes: string }) {
  const [resultado, setResultado] = useState<{ mes: string; clientes: ClienteFaturado[] } | null>(null);
  const [ordem, setOrdem] = useState<Ordem>('valor');

  useEffect(() => {
    buscarClientes(mes).then((clientes) => setResultado({ mes, clientes }));
  }, [mes]);

  const carregando = resultado?.mes !== mes;
  const clientes = useMemo(() => resultado?.clientes ?? [], [resultado]);

  const ordenados = useMemo(
    () =>
      [...clientes].sort((a, b) =>
        ordem === 'nome'
          ? a.razaoSocial.localeCompare(b.razaoSocial, 'pt-BR')
          : parseFloat(b.valorTotal) - parseFloat(a.valorTotal),
      ),
    [clientes, ordem],
  );

  return (
    <section className="clientes" aria-labelledby="clientes-titulo">
      <h2 id="clientes-titulo">Clientes em {formatMes(mes)}</h2>
      <div role="group" aria-label="Ordenar clientes">
        <button type="button" aria-pressed={ordem === 'valor'} onClick={() => setOrdem('valor')}>
          Maior valor
        </button>
        <button type="button" aria-pressed={ordem === 'nome'} onClick={() => setOrdem('nome')}>
          Nome
        </button>
      </div>

      {carregando ? (
        <p role="status">Carregando clientes…</p>
      ) : ordenados.length === 0 ? (
        <p>Nenhum cliente faturado em {formatMes(mes)}.</p>
      ) : (
        <ol className="clientes__lista">
          {ordenados.map((cliente, index) => (
            <ClienteItem key={index} cliente={cliente} />
          ))}
        </ol>
      )}
    </section>
  );
}

function ClienteItem({ cliente }: { cliente: ClienteFaturado }) {
  const [aberto, setAberto] = useState(false);

  return (
    <li className="cliente">
      <div className="cliente__linha">
        <span className="cliente__nome">{cliente.razaoSocial}</span>
        <span>{cliente.quantidadeNotas} notas</span>
        <span>{formatBRL(parseFloat(cliente.valorTotal))}</span>
        {cliente.comentarioContador && (
          <button type="button" aria-expanded={aberto} onClick={() => setAberto(!aberto)}>
            {aberto ? 'Ocultar comentário' : 'Comentário do contador'}
          </button>
        )}
      </div>
      {aberto && cliente.comentarioContador && (
        <div className="cliente__comentario" dangerouslySetInnerHTML={{ __html: cliente.comentarioContador }} />
      )}
    </li>
  );
}
