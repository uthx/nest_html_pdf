import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async root(@Res() res: Response) {
    try {
      console.log('trigged');
      const generatedHtml = await this.appService.generateHtml(
        res,
        { message: 'test1' },
        'home',
      );
      const generatedPDF =
        await this.appService.convertToHtmlToPDF(generatedHtml);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=generated.pdf',
      );
      res.send(generatedPDF);
    } catch (error) {}
  }
}
