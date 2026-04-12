import { Injectable } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { InjectGrpcClient } from '@razom-pay/common'
import type { AccountServiceClient } from '@razom-pay/contracts/gen/account'

import { AbstractGrpcClient } from '../../shared/grpc/abstract-grpc.client'

@Injectable()
export class AccountClientGrpc extends AbstractGrpcClient<AccountServiceClient> {
	constructor(
		@InjectGrpcClient('ACCOUNT_PACKAGE')
		client: ClientGrpc
	) {
		super(client, 'AccountService')
	}
}
