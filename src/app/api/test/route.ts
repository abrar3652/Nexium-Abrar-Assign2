import { NextResponse } from 'next/server';
        import { scrapeBlog } from '@/lib/scrapper';
        import { summarizeText } from '@/lib/summarizer';
        import { translateToUrdu } from '@/lib/translator';
        import { connectToDatabase } from '@/lib/mongodb';
        import BlogText from '@/models/BlogText';
        import { supabase } from '@/lib/supabase';

        export async function POST(request: Request) {
          try {
            const { url } = await request.json();
            if (!url) {
              return NextResponse.json({ error: 'URL is required' }, { status: 400 });
            }
            const { title, fullText } = await scrapeBlog(url);
            const summary = summarizeText(fullText);
            const urduSummary = translateToUrdu(summary);

            // Save to MongoDB
            await connectToDatabase();
            await BlogText.create({ title, fullText });

            // Save to Supabase
            const { error: supabaseError } = await supabase.from('summaries').insert({
              title,
              summary,
              urdu_summary: urduSummary,
            });
            if (supabaseError) throw supabaseError;

            return NextResponse.json({ title, summary, fullText, urduSummary });
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return NextResponse.json({ error: message }, { status: 500 });
            }
        }