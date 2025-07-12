import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeBlog(url: string) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $('h1').first().text().trim();
    const paragraphs = $('p').map((i, el) => $(el).text().trim()).get();
    const fullText = paragraphs.join(' ');
    return { title, fullText };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to scrape blog: ${error.message}`);
    } else {
      throw new Error('Failed to scrape blog: Unknown error');
    }
  }
}
