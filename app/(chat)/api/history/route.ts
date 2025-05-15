import { auth } from '@/app/(auth)/auth';
import { NextRequest } from 'next/server';
import { getChatsByUserIdAndChatType } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const limit = parseInt(searchParams.get('limit') || '10');
  const startingAfter = searchParams.get('starting_after');
  const endingBefore = searchParams.get('ending_before');
  let chatType = searchParams.get('type');
  // console.log('chatTYpe ', chatTYpe);
  if(chatType === null || (chatType !== 'chat' && chatType !== 'rag')) {
    chatType = 'chat';
  }
  let chatTypeParam: 'chat' | 'rag' = chatType as 'chat' | 'rag';

  if (startingAfter && endingBefore) {
    return Response.json(
      'Only one of starting_after or ending_before can be provided!',
      { status: 400 },
    );
  }

  const session = await auth();

  if (!session?.user?.id) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  try {
    const chats = await getChatsByUserIdAndChatType({
      id: session.user.id,
      chatType: chatTypeParam,
      limit,
      startingAfter,
      endingBefore,
    });

    return Response.json(chats);
  } catch (_) {
    return Response.json('Failed to fetch chats!', { status: 500 });
  }
}
