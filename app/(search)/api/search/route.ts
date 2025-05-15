import { searchDinosByVector } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(request: NextResponse) {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text') as string;
    console.log('search text : ', text);
    const result = {
        data: [],
        error: null
    }
    try{
        const searchResult = await searchDinosByVector(text, 10)
        result.data = searchResult;
    }catch(e){
        console.error('API:SEARCH: Error during search', e);
        result.error = e;
    }
    // console.log(result);
    
    if (result) {
      if (result.error) {
        return NextResponse.json(
          {
            message: 'API:SEARCH: Error during search See the logs'
          },
          {
            status: 500
          }
        );
      }
      return NextResponse.json(
        {
          message: 'API:SEARCH: Successful search',
          data: result.data
        },
        {
          status: 201
        }
      );
    }
    return NextResponse.json(
      {
        message: 'API:SEARCH: unknown error during search'
      },
      {
        status: 500
      }
    );
  }
  