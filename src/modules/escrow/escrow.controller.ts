import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CurrentUser } from '../../shared/decorators/current-user.decorator'
import { Protected } from '../../shared/decorators/protected.decorators'

import { ContributeDto } from './dto/contribute.dto'
import { EscrowClientGrpc } from './escrow.grpc'

// protobuf int64 fields arrive as Long objects {low,high,unsigned} when the
// grpc loader does not have longs:Number configured (e.g. npm-installed common).
// Convert them to regular JS numbers so the HTTP response is clean JSON.
function fromLong(v: unknown): number {
	if (v !== null && typeof v === 'object' && 'low' in v && 'high' in v) {
		const l = v as { low: number; high: number; unsigned: boolean }
		return l.high * 0x100000000 + (l.low >>> 0)
	}
	return Number(v)
}

function normalizeContribution(c: Record<string, unknown>) {
	return {
		...c,
		amount: fromLong(c.amount),
		refundedAmount: fromLong(c.refundedAmount)
	}
}

function normalizeEscrow(e: Record<string, unknown>) {
	return {
		...e,
		totalFrozen: fromLong(e.totalFrozen),
		totalReleased: fromLong(e.totalReleased),
		totalRefunded: fromLong(e.totalRefunded)
	}
}

@ApiTags('Escrow')
@Controller('escrow')
export class EscrowController {
	constructor(private readonly escrowClient: EscrowClientGrpc) {}

	@ApiBearerAuth()
	@Post(':initiativeId/contribute')
	@Protected()
	@ApiOperation({ summary: 'Contribute funds to an initiative escrow' })
	async contribute(
		@Param('initiativeId') initiativeId: string,
		@CurrentUser() userId: string,
		@Body() dto: ContributeDto
	) {
		const res = await this.escrowClient.call('contribute', {
			initiativeId,
			userId,
			amount: dto.amount
		})
		const r = res as { contribution: Record<string, unknown> }
		return { contribution: normalizeContribution(r.contribution) }
	}

	@ApiBearerAuth()
	@Get(':initiativeId')
	@Protected()
	@ApiOperation({ summary: 'Get escrow status for an initiative' })
	async getEscrow(@Param('initiativeId') initiativeId: string) {
		const res = await this.escrowClient.call('getEscrow', { initiativeId })
		const r = res as { escrow: Record<string, unknown> }
		return { escrow: normalizeEscrow(r.escrow) }
	}

	@ApiBearerAuth()
	@Get(':initiativeId/contributions')
	@Protected()
	@ApiOperation({ summary: 'List all contributions for an initiative escrow' })
	async listContributions(@Param('initiativeId') initiativeId: string) {
		const res = await this.escrowClient.call('listContributions', { initiativeId })
		const r = res as { contributions: Record<string, unknown>[] }
		return { contributions: r.contributions.map(normalizeContribution) }
	}

	@ApiBearerAuth()
	@Get(':initiativeId/my-contributions')
	@Protected()
	@ApiOperation({ summary: "List current user's contributions" })
	async myContributions(
		@Param('initiativeId') initiativeId: string,
		@CurrentUser() userId: string
	) {
		const res = await this.escrowClient.call('getUserContributions', {
			initiativeId,
			userId
		})
		const r = res as { contributions: Record<string, unknown>[] }
		return { contributions: r.contributions.map(normalizeContribution) }
	}

	@ApiBearerAuth()
	@Post(':initiativeId/settle')
	@Protected()
	@ApiOperation({ summary: 'Manually trigger settlement for an initiative escrow' })
	async settle(@Param('initiativeId') initiativeId: string) {
		const res = await this.escrowClient.call('settleEscrow', { initiativeId })
		const r = res as { escrow: Record<string, unknown> }
		return { escrow: normalizeEscrow(r.escrow) }
	}
}
