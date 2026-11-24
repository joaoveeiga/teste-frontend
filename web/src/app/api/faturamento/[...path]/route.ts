import { NextResponse, type NextRequest } from 'next/server';
import { apiUrl, getJson, HttpError } from '@/lib/api';

// One proxy for the dashboard endpoints: /v1/faturamento/mensal and /v1/faturamento/clientes.
export async function GET(request: NextRequest, { params }: RouteContext<'/api/faturamento/[...path]'>) {
  const { path } = await params;

  try {
    const url = apiUrl(`/v1/faturamento/${path.join('/')}${request.nextUrl.search}`);
    const data = await getJson<unknown>(url);
    return NextResponse.json(data, {
      // Billing only changes when a nota is issued or cancelled; let the CDN absorb the dashboard refreshes.
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (error) {
    if (error instanceof HttpError && error.status === 400) {
      return NextResponse.json({ message: 'Filtro inválido.' }, { status: 400 });
    }
    console.error('GET /api/faturamento failed', error);
    return NextResponse.json({ message: 'Não foi possível consultar o faturamento.' }, { status: 502 });
  }
}
