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
         const { error: supabaseError, data } = await supabase.from('summaries').insert({
           title,
           summary,
           urdu_summary: urduSummary,
         });
         if (supabaseError) {
           console.error('Supabase Error:', JSON.stringify(supabaseError, null, 2));
           throw supabaseError;
         }
         console.log('Supabase Data:', data);

         return NextResponse.json({ title, summary, fullText, urduSummary });
       } catch (error) {
         console.error('API Error:', JSON.stringify(error, null, 2));
         const message = error instanceof Error ? error.message : JSON.stringify(error);
         return NextResponse.json({ error: message }, { status: 500 });
       }
     }