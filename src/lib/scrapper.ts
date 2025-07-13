import axios from 'axios';
import * as cheerio from 'cheerio';

  export async function scrapeBlog(url: string) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const title = $('h1').first().text().trim() || $('title').text().split('|')[0].trim();
      const article = $('article').length ? $('article') : $('.content-wrapper');
      const paragraphs = article.find('p').map((i, el) => $(el).text().trim()).get().filter(p => p.length > 10);
      const fullText = paragraphs.join('\n\n');
      return { title, fullText };
    } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to scrape blog: ${error.message}`);
    } else {
      throw new Error('Failed to scrape blog: Unknown error');
    }    }
  }