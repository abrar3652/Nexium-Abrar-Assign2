export function summarizeText(fullText: string): string {
       const sentences = fullText.split('.').filter(s => s.trim());
       const summaryLength = Math.min(3, sentences.length);
       const summary = sentences.slice(0, summaryLength).join('. ') + (summaryLength > 0 ? '.' : '');
       const words = summary.split(' ').slice(0, 100).join(' ');
       return words.length < summary.length ? words + '...' : summary;
     }