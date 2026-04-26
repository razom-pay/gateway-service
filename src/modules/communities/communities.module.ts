import { Module } from '@nestjs/common'
import { GrpcModule } from '@razom-pay/common'

import { EscrowModule } from '../escrow/escrow.module'

import { CommunitiesController } from './communities.controller'
import { CommunitiesClientGrpc } from './communities.grpc'
import { InitiativesController } from './initiatives.controller'

@Module({
	imports: [GrpcModule.register(['COMMUNITIES_PACKAGE']), EscrowModule],
	controllers: [CommunitiesController, InitiativesController],
	providers: [CommunitiesClientGrpc],
	exports: [CommunitiesClientGrpc]
})
export class CommunitiesModule {}
