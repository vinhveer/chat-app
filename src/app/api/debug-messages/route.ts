import { NextResponse } from 'next/server';
import { MessageController } from '@/data/controllers/message';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    
    if (!roomId) {
      return NextResponse.json({ error: 'roomId is required' }, { status: 400 });
    }

    const result = await MessageController.getMessages({ roomId });
    
    return NextResponse.json({
      success: result.status === 'success',
      status: result.status,
      message: result.message,
      messagesCount: result.data?.length || 0,
      messages: result.data?.map(msg => ({
        id: msg.id,
        user_id: msg.user_id,
        body: msg.body,
        user: msg.user,
        created_at: msg.created_at
      })) || []
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch messages', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
