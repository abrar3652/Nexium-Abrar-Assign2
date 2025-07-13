import { NextResponse } from 'next/server';
  import { scrapeBlog } from '@/lib/scrapper';
  import { summarizeText } from '@/lib/summarizer';

  export async function POST(request: Request) {
    try {
      const { url } = await request.json();
      if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
      }
      const { title, fullText } = await scrapeBlog(url);
      const summary = summarizeText(fullText);
      return NextResponse.json({ title, summary, fullText });
    } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });

    }
  }