import { PainelFaturamento } from '@/components/faturamento/PainelFaturamento';

export default function FaturamentoPage() {
  return (
    <section>
      <h1>Faturamento</h1>
      <p>Uso interno do financeiro. Não compartilhe estes números fora da empresa.</p>
      <PainelFaturamento />
    </section>
  );
}
