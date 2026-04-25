import { Module } from '@nestjs/common'
import { GrpcModule } from '@razom-pay/common'

import { CommunityController } from './community.controller'
import { CommunityClientGrpc } from './community.grpc'
import { InitiativeController } from './initiative.controller'
import { InitiativeClientGrpc } from './initiative.grpc'

@Module({
	imports: [GrpcModule.register(['COMMUNITY_PACKAGE'])],
	controllers: [CommunityController, InitiativeController],
	providers: [CommunityClientGrpc, InitiativeClientGrpc],
	exports: [CommunityClientGrpc, InitiativeClientGrpc]
})
export class CommunityModule {}
