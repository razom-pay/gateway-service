import { Module } from '@nestjs/common'
import { GrpcModule } from '@razom-pay/common'

import { CommunityController } from './community.controller'
import { CommunityClientGrpc } from './community.grpc'

@Module({
	imports: [GrpcModule.register(['COMMUNITY_PACKAGE'])],
	controllers: [CommunityController],
	providers: [CommunityClientGrpc],
	exports: [CommunityClientGrpc]
})
export class CommunityModule {}
