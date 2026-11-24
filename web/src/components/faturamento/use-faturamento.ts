'use client';

import { useCallback, useEffect, useState } from 'react';
import { getJson } from '@/lib/api';
import type { FaturamentoMensal } from '@/lib/faturamento';

const ERRO = 'Não foi possível carregar o faturamento.';

type Resultado = {
  ano: number;
  dados: FaturamentoMensal | null;
  erro: string | null;
};

export function useFaturamentoMensal(ano: number) {
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    getJson<FaturamentoMensal>(`/api/faturamento/mensal?ano=${ano}`)
      .then((dados) => setResultado({ ano, dados, erro: null }))
      .catch(() => setResultado({ ano, dados: null, erro: ERRO }));
  }, [ano]);

  // Stable reference, so the auto-refresh interval is not recreated on every render.
  const recarregar = useCallback(() => {
    getJson<FaturamentoMensal>(`/api/faturamento/mensal?ano=${ano}`)
      .then((dados) => setResultado({ ano, dados, erro: null }))
      .catch(() => setResultado({ ano, dados: null, erro: ERRO }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    dados: resultado?.dados ?? null,
    erro: resultado?.erro ?? null,
    carregando: resultado?.ano !== ano,
    recarregar,
  };
}
