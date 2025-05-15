import { MainPageComponent } from "./mainPageComponent";
import { auth } from './../(auth)/auth';
import { redirect } from 'next/navigation';

export default async function Page(){
      const session = await auth();
    
      if (!session) {
        redirect('/api/auth/guest');
      }
      
    return <MainPageComponent/>
}