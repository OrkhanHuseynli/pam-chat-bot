'use client'
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';


export function MainPageComponent() {

    
    return   (<><div className='h-screen justify-center flex flex-col items-center gap-2'>
        <div className='justify-center align-center items-center flex flex-col gap-2 h-[100px]'>
        <h1 className='text-blue-500 text-4xl'>PAM AI CHATBOT </h1>
        <Bot className="h-12 w-12 text-blue-500 mb-2" />
        </div>
        <div className='justify-center align-center items-center flex flex-row gap-2'>
        <MainPageButton title="Regular Chat" description='Standard AI Chat' path='chat'/>
        <MainPageButton title="RAG Chatbot" description='AI Chat with integrated RAG' path='rag'/>
        <MainPageButton title="Vector search" description='Test the vector data used for RAG' path='search'/>
        </div>
  </div>
  <div className='invisible'>
      </div>
      </>
      
  )
}  

function MainPageButton({title, description, path}: {title: string, description: string, path: string}) {
    
    return (
        <div className='justify-center align-center items-center flex flex-row gap-2 w-[250px]'>
            <Button
                variant="ghost"
                onClick={async () => {
                    window.history.replaceState({}, '', `/${path}`);
                    window.location.href=`/${path}`;
                }}
                className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
            >
                <span className="font-medium">{title}</span>
                <span className="text-muted-foreground">
                   {description}
                </span>
            </Button>
        </div>
    );
}

  // if (!modelIdFromCookie) {
  //   return (
  //     <>
  //       <Chat
  //         key={id}
  //         id={id}
  //         initialMessages={[]}
  //         initialChatModel={DEFAULT_CHAT_MODEL}
  //         initialVisibilityType="private"
  //         isReadonly={false}
  //         session={session}
  //         autoResume={false}
  //       />
  //       <DataStreamHandler id={id} />
  //     </>
  //   );
  // }

  // return (
  //   <>
  //     <Chat
  //       key={id}
  //       id={id}
  //       initialMessages={[]}
  //       initialChatModel={modelIdFromCookie.value}
  //       initialVisibilityType="private"
  //       isReadonly={false}
  //       session={session}
  //       autoResume={false}
  //     />
  //     <DataStreamHandler id={id} />
  //   </>
  // );