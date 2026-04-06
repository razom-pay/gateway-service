import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Role } from '@razom-pay/contracts/gen/account'
import type { Request } from 'express'
import { lastValueFrom } from 'rxjs'

import { AccountClientGrpc } from '../../modules/account/account.grpc'
import { ROLES_KEY } from '../decorators'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly accountClientGrpc: AccountClientGrpc
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		])
		if (!required || required.length === 0) return true

		const request = context.switchToHttp().getRequest<Request>()

		const user = request.user

		if (!user) throw new ForbiddenException('User context is missing')

		const account = await lastValueFrom(
			this.accountClientGrpc.getAccount({ id: user.id })
		)

		if (!account) throw new NotFoundException('Account not found')

		if (!required.includes(account.role)) {
			throw new ForbiddenException(
				'You do not have permission to access this resource'
			)
		}

		return true
	}
}
