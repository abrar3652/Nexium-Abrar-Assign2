import { NextResponse } from 'next/server';
     import { scrapeBlog } from '@/lib/scrapper';
     import { summarizeText } from '@/lib/summarizer';
     import { translateToUrdu } from '@/lib/translator';

     export async function POST(request: Request) {
       try {
         const { url } = await request.json();
         if (!url) {
           return NextResponse.json({ error: 'URL is required' }, { status: 400 });
         }
         const { title, fullText } = await scrapeBlog(url);
         const summary = summarizeText(fullText);
         const urduSummary = translateToUrdu(summary);
         return NextResponse.json({ title, summary,  urduSummary,fullText, });
       } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
       }
     }
