import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { Browser, launch } from 'puppeteer';
@Injectable()
export class AppService {
  async generateHtml(
    res: Response,
    templateData: Record<string, string>,
    templateName: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      res.render(templateName, templateData, (err, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    });
  }
  private async initBrowser(): Promise<Browser> {
    try {
      return launch({
        headless: 'new',
        args: ['--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
      });
    } catch (error) {
      console.log(`Error while initializing the browser : `, error.name);
    }
  }
  async convertToHtmlToPDF(html: string): Promise<Buffer> {
    try {
      const browser = await this.initBrowser();
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'domcontentloaded' });

      const pdf = await page.pdf({
        format: 'A4',
      });
      await browser.close();
      return pdf;
    } catch (error) {
      console.log(`Error while converting HTML to PDF : `, error.name);
    }
  }
}
