import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

type RequestWithAuthHeader = {
  headers: {
    authorization?: string;
  };
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuthHeader>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Токен не передан");
    }

    const [tokenType, token] = authHeader.split(" ");

    if (tokenType !== "Bearer" || !token) {
      throw new UnauthorizedException("Неверный формат токена");
    }

    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch {
      throw new UnauthorizedException("Токен недействителен");
    }
  }
}
