import { Inject, Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { api } from './api';
import { AuthService } from '../auth/auth.service';
import { REQUEST } from '@nestjs/core';


@Injectable()
export class RemultMiddleware implements NestMiddleware {

    constructor(private authService: AuthService) { }
    use(req: Request, res: Response, next: NextFunction) {
        this.authService.updateRequestWithUserInfoBasedOnHeader(req);
        api(req, res, next);
    }
}

@Injectable({ scope: Scope.REQUEST })
export class RemultFactoryService {
    constructor(@Inject(REQUEST) private request: Request, private authService: AuthService) { }
    async getRemult() {
        this.authService.updateRequestWithUserInfoBasedOnHeader(this.request);
        return await api.getRemult(this.request);
    }
}