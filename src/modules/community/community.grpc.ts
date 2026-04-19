import { Injectable } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import { InjectGrpcClient } from '@razom-pay/common'
import type { CommunityServiceClient } from '@razom-pay/contracts/gen/community'

import { AbstractGrpcClient } from '../../shared/grpc/abstract-grpc.client'

@Injectable()
export class CommunityClientGrpc extends AbstractGrpcClient<CommunityServiceClient> {
	constructor(
		@InjectGrpcClient('COMMUNITY_PACKAGE')
		client: ClientGrpc
	) {
		super(client, 'CommunityService')
	}
}
