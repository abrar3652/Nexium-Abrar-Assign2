export function summarizeText(fullText: string): string {
  const sentences = fullText.split('.').filter(s => s.trim().length > 10);
  if (sentences.length === 0) return 'No summary available.';
  const words = fullText.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const wordFreq = words.reduce((acc, word) => { acc[word] = (acc[word] || 0) + 1; return acc; }, {} as Record<string, number>);
  const importantWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) => w);
  const summarySentences = sentences.slice(0, 5).filter(s => importantWords.some(w => s.toLowerCase().includes(w)));

  let summary = summarySentences.join('. ') + (summarySentences.length > 0 ? '.' : '');
  if (summarySentences.length < 3) {
    // Pad with additional relevant sentences if fewer than 3
    const extraSentences = sentences.filter(s => !summarySentences.includes(s)).slice(0, 3 - summarySentences.length);
    summary = [summary, ...extraSentences.map(s => s.trim())].join('. ').trim() + '.';
  }
  return summary;
}