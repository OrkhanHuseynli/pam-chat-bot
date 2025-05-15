import {
  appendClientMessage,
  appendResponseMessages,
  createDataStream,
  smoothStream,
  streamText,
  tool, 
  generateObject
} from 'ai';
import { auth, type UserType } from '@/app/(auth)/auth';
import { type RequestHints, systemPrompt } from '@/lib/ai/prompts';
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  getStreamIdsByChatId,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import { generateUUID, getTrailingMessageId } from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { isProductionEnvironment } from '@/lib/constants';
import { myProvider } from '@/lib/ai/providers';
import { entitlementsByUserType } from '@/lib/ai/entitlements';
import { postRequestBodySchema, type PostRequestBody } from './schema';
import { geolocation } from '@vercel/functions';
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from 'resumable-stream';
import { after } from 'next/server';
import type { Chat, dinosaurs } from '@/lib/db/schema';
import { differenceInSeconds } from 'date-fns';
import { findRelevantContent } from '@/lib/ai/embeddings';
import { z } from "zod";
import { exec } from 'child_process';
import { list } from '@vercel/blob';


export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      });
    } catch (error: any) {
      if (error.message.includes('REDIS_URL')) {
        console.log(
          ' > Resumable streams are disabled due to missing REDIS_URL',
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new Response('Invalid request body', { status: 400 });
  }

  try {
    const { id, type, message, selectedChatModel, selectedVisibilityType } =
      requestBody;
    const session = await auth();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userType: UserType = session.user.type;

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
      return new Response(
        'You have exceeded your maximum number of messages for the day! Please try again later.',
        {
          status: 429,
        },
      );
    }

    const chat = await getChatById({ id });

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message,
      });

      await saveChat({
        id,
        type: type==='rag'?'rag':'chat',
        userId: session.user.id,
        title,
        visibility: selectedVisibilityType,
      });
    } else {
      if (chat.userId !== session.user.id) {
        return new Response('Forbidden', { status: 403 });
      }
    }

    const previousMessages = await getMessagesByChatId({ id });

    const messages = appendClientMessage({
      // @ts-expect-error: todo add type conversion from DBMessage[] to UIMessage[]
      messages: previousMessages,
      message,
    });

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: 'user',
          parts: message.parts,
          attachments: message.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    // let stream = null 
    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

     let stream = createDataStream({
      execute: (dataStream) => {

        let result = null;
        if(type === 'rag') {
          result = createStreamTextForRag(selectedChatModel, messages, message, id, session, dataStream);
        } else {
         result = createStreamTextForChat(selectedChatModel, requestHints, messages, session, dataStream, message, id);
        }
        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: () => {
        return 'Oops, an error occurred!';
      },
    });
    

    const streamContext = getStreamContext();

    if (streamContext) {
      return new Response(
        await streamContext.resumableStream(streamId, () => stream),
      );
    } else {
      return new Response(stream);
    }
  } catch (_) {
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}

function createStreamTextForChat(selectedChatModel: string, requestHints: RequestHints, messages:any, session:any, dataStream:any, message: { id: string; createdAt: Date; content: string; role: "user"; parts: { type: "text"; text: string; }[]; experimental_attachments?: { name: string; url: string; contentType: "image/png" | "image/jpg" | "image/jpeg"; }[] | undefined; }, id: string) {
  return streamText({
    model: myProvider.languageModel(selectedChatModel),
    system: systemPrompt({ selectedChatModel, requestHints }),
    messages,
    maxSteps: 5,
    experimental_activeTools: selectedChatModel === 'chat-model-reasoning'
      ? []
      : [
        'getWeather',
        'createDocument',
        'updateDocument',
        'requestSuggestions',
      ],
    experimental_transform: smoothStream({ chunking: 'word' }),
    experimental_generateMessageId: generateUUID,
    tools: {
      getWeather,
      createDocument: createDocument({ session, dataStream }),
      updateDocument: updateDocument({ session, dataStream }),
      requestSuggestions: requestSuggestions({
        session,
        dataStream,
      }),
    },
    onFinish: async ({ response }) => {
      if (session.user?.id) {
        try {
          const assistantId = getTrailingMessageId({
            messages: response.messages.filter(
              (message) => message.role === 'assistant'
            ),
          });

          if (!assistantId) {
            throw new Error('No assistant message found!');
          }

          const [, assistantMessage] = appendResponseMessages({
            messages: [message],
            responseMessages: response.messages,
          });

          await saveMessages({
            messages: [
              {
                id: assistantId,
                chatId: id,
                role: assistantMessage.role,
                parts: assistantMessage.parts,
                attachments: assistantMessage.experimental_attachments ?? [],
                createdAt: new Date(),
              },
            ],
          });
        } catch (_) {
          console.error('Failed to save chat');
        }
      }
    },
    experimental_telemetry: {
      isEnabled: isProductionEnvironment,
      functionId: 'stream-text',
    },
  });
}

function naiveRugText(){

}

function createStreamTextForRag(selectedChatModel: string, messages: any[], message: any, id: string, session: any, dataStream: any) {
  const result = streamText({
    model: myProvider.languageModel(selectedChatModel),
    messages,
    system: `You are a helpful assistant acting as the users' second brain.
    Use tools on every request.
    Be sure to getInformation from your knowledge base before answering any questions. It will provide you with the list of dinosaurs most relevant to the users' query.
    If a response requires multiple tools, call one tool after another without responding to the user.
    If a response requires information from an additional tool to generate a response, call the appropriate tools in order before responding to the user.
    ONLY respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."
    Be sure to adhere to any instructions in tool calls ie. if they say to responsd like "...", do exactly that.
    If the relevant information is not a direct match to the users prompt, you can be creative in deducing the answer.
    Keep responses short and concise. Answer in a single sentence where possible.
    If you are unsure, use the getInformation tool and you can use common sense to reason based on the information you do have.
    Use your abilities as a reasoning machine to answer questions based on the information you do have.
    Don't respond to any questions that are not related to dinosaurs and are not from your knowledge base. If user asks a question that is not related to dinosaurs, respond with "I am a dinosaur assistant. I can only answer questions about dinosaurs. Please ask me a question about dinosaurs.".
`,
    maxSteps: 5,
    experimental_activeTools: selectedChatModel === 'chat-model-reasoning'
    ? []
    : [
      'getInformation',
      'understandQuery',
    ],
    experimental_transform: smoothStream({ chunking: 'word' }),
    experimental_generateMessageId: generateUUID,
    tools: {
      understandQuery: tool({
        description: `understand the users query. use this tool on every prompt whose length is bigger than 300 characters.`,
        parameters: z.object({
          query: z.string().describe("the users query"),
          toolsToCallInOrder: z
            .array(z.string())
            .describe(
              "these are the tools you need to call in the order necessary to respond to the users query",
            ),
        }),
        execute: async ({ query }) => {
          const { object } = await generateObject({
            model: myProvider.languageModel(selectedChatModel),
            system:
              "You are a query understanding assistant. Analyze the user query and generate similar questions.",
            schema: z.object({
              questions: z
                .array(z.string())
                .max(2)
                .describe("similar questions to the user's query. be concise."),
            }),
            prompt: `Analyze this query: "${query}". Provide the following:
                    2 similar questions that could help answer the user's query`,
          });
          return object.questions;
        },
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe("the users question"),
          similarQuestions: z.array(z.string()).describe("keywords to search"),
        }),
        execute: async ({ similarQuestions, question }) => {
          const results = await Promise.all(
            similarQuestions.map(
              async (question) => await findRelevantContent(question),
            ),
          );
              // Flatten the array of arrays and remove duplicates based on 'name'
              const uniqueResults = Array.from(
                new Map(results.flat().map((item) => [item?.name, item])).values(),
              );
              return uniqueResults;
        },
      }),
    },
    onFinish: async ({ response }) => {
      if (session.user?.id) {
        try {
          const assistantId = getTrailingMessageId({
            messages: response.messages.filter(
              (message) => message.role === 'assistant'
            ),
          });

          if (!assistantId) {
            throw new Error('No assistant message found!');
          }
          const [, assistantMessage] = appendResponseMessages({
            messages: [message],
            responseMessages: response.messages,
          });

          await saveMessages({
            messages: [
              {
                id: assistantId,
                chatId: id,
                role: assistantMessage.role,
                parts: assistantMessage.parts,
                attachments: assistantMessage.experimental_attachments ?? [],
                createdAt: new Date(),
              },
            ],
          });
        } catch (_) {
          console.error('Failed to save chat');
        }
      }
    },
    experimental_telemetry: {
      isEnabled: isProductionEnvironment,
      functionId: 'stream-text',
    },
  });

  return result;
}

export async function GET(request: Request) {
  const streamContext = getStreamContext();
  const resumeRequestedAt = new Date();

  if (!streamContext) {
    return new Response(null, { status: 204 });
  }

  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return new Response('id is required', { status: 400 });
  }

  const session = await auth();

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  let chat: Chat;

  try {
    chat = await getChatById({ id: chatId });
  } catch {
    return new Response('Not found', { status: 404 });
  }

  if (!chat) {
    return new Response('Not found', { status: 404 });
  }

  if (chat.visibility === 'private' && chat.userId !== session.user.id) {
    return new Response('Forbidden', { status: 403 });
  }

  const streamIds = await getStreamIdsByChatId({ chatId });

  if (!streamIds.length) {
    return new Response('No streams found', { status: 404 });
  }

  const recentStreamId = streamIds.at(-1);

  if (!recentStreamId) {
    return new Response('No recent stream found', { status: 404 });
  }

  const emptyDataStream = createDataStream({
    execute: () => {},
  });

  const stream = await streamContext.resumableStream(
    recentStreamId,
    () => emptyDataStream,
  );

  /*
   * For when the generation is streaming during SSR
   * but the resumable stream has concluded at this point.
   */
  if (!stream) {
    const messages = await getMessagesByChatId({ id: chatId });
    const mostRecentMessage = messages.at(-1);

    if (!mostRecentMessage) {
      return new Response(emptyDataStream, { status: 200 });
    }

    if (mostRecentMessage.role !== 'assistant') {
      return new Response(emptyDataStream, { status: 200 });
    }

    const messageCreatedAt = new Date(mostRecentMessage.createdAt);

    if (differenceInSeconds(resumeRequestedAt, messageCreatedAt) > 15) {
      return new Response(emptyDataStream, { status: 200 });
    }

    const restoredStream = createDataStream({
      execute: (buffer) => {
        buffer.writeData({
          type: 'append-message',
          message: JSON.stringify(mostRecentMessage),
        });
      },
    });

    return new Response(restoredStream, { status: 200 });
  }

  return new Response(stream, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Forbidden', { status: 403 });
    }

    const deletedChat = await deleteChatById({ id });

    return Response.json(deletedChat, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('An error occurred while processing your request!', {
      status: 500,
    });
  }
}
