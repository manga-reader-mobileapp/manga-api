import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const CurrentPlayer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1]; // Assumindo que o token JWT está no cabeçalho de autorização
    const jwtService = new JwtService();
    const decodedToken = jwtService.decode(token) as { id: string; email: string; name: string; project_id: string }; // Decodifica o token JWT
    return decodedToken; // Retorna todos os campos do token JWT, incluindo 'project_id'
  },
);