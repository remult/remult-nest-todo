import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Remult } from 'remult';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { Task } from './shared/Task';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService, private remult: Remult) { }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('testRemultOrm')
  async getDataFromRemult() {
    return await this.remult.repo(Task).count();
  }
  @Get('api/test')
  async getTest() {
    return { result: await this.remult.repo(Task).count() };
  }
}