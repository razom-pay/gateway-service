import { Injectable } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { InjectGrpcClient } from '@razom-pay/common'
import type { UsersServiceClient } from '@razom-pay/contracts/gen/users'

import { AbstractGrpcClient } from '../../shared/grpc/abstract-grpc.client'

@Injectable()
export class UsersClientGrpc extends AbstractGrpcClient<UsersServiceClient> {
	constructor(
		@InjectGrpcClient('USERS_PACKAGE')
		client: ClientGrpc
	) {
		super(client, 'UsersService')
	}
}
