import { Module } from '@nestjs/common'
import { GrpcModule } from '@razom-pay/common'

import { CommunitiesController } from './communities.controller'
import { CommunitiesClientGrpc } from './communities.grpc'
import { InitiativesController } from './initiatives.controller'

@Module({
	imports: [GrpcModule.register(['COMMUNITIES_PACKAGE'])],
	controllers: [CommunitiesController, InitiativesController],
	providers: [CommunitiesClientGrpc],
	exports: [CommunitiesClientGrpc]
})
export class CommunitiesModule {}
