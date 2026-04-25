import { Injectable } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { InjectGrpcClient } from '@razom-pay/common'
import type { CommunitiesServiceClient } from '@razom-pay/contracts/gen/communities'

import { AbstractGrpcClient } from '../../shared/grpc/abstract-grpc.client'

@Injectable()
export class CommunitiesClientGrpc extends AbstractGrpcClient<CommunitiesServiceClient> {
	constructor(
		@InjectGrpcClient('COMMUNITIES_PACKAGE')
		client: ClientGrpc
	) {
		super(client, 'CommunitiesService')
	}
}
