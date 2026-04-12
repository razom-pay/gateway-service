import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import type {
	GetMeRequest,
	PatchUserRequest,
	UsersServiceClient
} from '@razom-pay/contracts/gen/users'

@Injectable()
export class UsersClientGrpc implements OnModuleInit {
	private usersService!: UsersServiceClient

	constructor(@Inject('USERS_PACKAGE') private readonly client: ClientGrpc) {}

	onModuleInit() {
		this.usersService =
			this.client.getService<UsersServiceClient>('UsersService')
	}

	getMe(request: GetMeRequest) {
		return this.usersService.getMe(request)
	}

	patchUser(request: PatchUserRequest) {
		return this.usersService.patchUser(request)
	}
}
