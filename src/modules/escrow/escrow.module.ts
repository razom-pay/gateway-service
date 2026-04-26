import { Module } from '@nestjs/common'
import { GrpcModule } from '@razom-pay/common'

import { EscrowController } from './escrow.controller'
import { EscrowClientGrpc } from './escrow.grpc'

@Module({
	imports: [GrpcModule.register(['ESCROW_PACKAGE'])],
	controllers: [EscrowController],
	providers: [EscrowClientGrpc],
	exports: [EscrowClientGrpc]
})
export class EscrowModule {}
