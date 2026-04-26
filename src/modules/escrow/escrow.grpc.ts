import { Injectable } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { InjectGrpcClient } from '@razom-pay/common'
import type { EscrowServiceClient } from '@razom-pay/contracts/gen/escrow'

import { AbstractGrpcClient } from '../../shared/grpc/abstract-grpc.client'

@Injectable()
export class EscrowClientGrpc extends AbstractGrpcClient<EscrowServiceClient> {
	constructor(
		@InjectGrpcClient('ESCROW_PACKAGE')
		client: ClientGrpc
	) {
		super(client, 'EscrowService')
	}
}
