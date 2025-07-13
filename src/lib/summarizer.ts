export function summarizeText(fullText: string): string {
    const sentences = fullText.split('.').filter(s => s.trim().length > 10);
    if (sentences.length === 0) return 'No summary available.';
    const words = fullText.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const wordFreq = words.reduce((acc, word) => { acc[word] = (acc[word] || 0) + 1; return acc; }, {} as Record<string, number>);
    const importantWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) => w);
    const summarySentences = sentences.slice(0, 3).filter(s => importantWords.some(w => s.toLowerCase().includes(w)));
    const summary = summarySentences.join('. ') + (summarySentences.length > 0 ? '.' : '');
    return summary.length > 100 ? summary.substring(0, 100) + '...' : summary;
  }