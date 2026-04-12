import { Module } from '@nestjs/common'
import { GrpcModule } from '@razom-pay/common'

import { UsersController } from './users.controller'
import { UsersClientGrpc } from './users.grpc'

@Module({
	imports: [GrpcModule.register(['USERS_PACKAGE'])],
	controllers: [UsersController],
	providers: [UsersClientGrpc],
	exports: [UsersClientGrpc]
})
export class UsersModule {}
