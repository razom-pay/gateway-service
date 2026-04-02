import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { PassportService } from '@razom-pay/passport'
import type { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly passportService: PassportService) {}
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>()

		const token = this.extractToken(request)

		if (!token) throw new UnauthorizedException('Token is missing')

		const result = this.passportService.verifyToken(token)

		if (!result.valid) throw new UnauthorizedException(result.reason)

		if (!result.userId)
			throw new UnauthorizedException('Invalid token payload')

		request.user = {
			id: result.userId
		}

		return true
	}

	private extractToken(request: Request) {
		const header = request.headers.authorization

		if (!header)
			throw new UnauthorizedException('Authorization header is missing')

		if (!header.startsWith('Bearer '))
			throw new UnauthorizedException('Invalid authorization header')

		const token = header.split(' ')[1]

		if (!token)
			throw new UnauthorizedException(
				'Token is missing from authorization header'
			)

		return token
	}
}
