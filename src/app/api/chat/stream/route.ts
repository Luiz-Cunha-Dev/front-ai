import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // Fazer proxy para a API externa
    const response = await fetch('http://129.148.34.13:3000/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Erro na API externa');
    }

    // Retornar a resposta de streaming
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Erro na API:', error);
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
