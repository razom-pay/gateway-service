import { Controller, Get, Param, Post, Body } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CurrentUser } from '../../shared/decorators/current-user.decorator'
import { Protected } from '../../shared/decorators/protected.decorators'
import { EscrowClientGrpc } from '../escrow/escrow.grpc'

import { CommunitiesClientGrpc } from './communities.grpc'
import { CreateInitiativeDto } from './dto/requests/initiatives.dto'

@ApiTags('Communities / Initiatives')
@Controller('communities/:communityId/initiatives')
export class InitiativesController {
	constructor(
		private readonly communitiesClient: CommunitiesClientGrpc,
		private readonly escrowClient: EscrowClientGrpc
	) {}

	@ApiBearerAuth()
	@Post()
	@Protected()
	@ApiOperation({ summary: 'Create an initiative in a community' })
	async createInitiative(
		@Param('communityId') communityId: string,
		@CurrentUser() userId: string,
		@Body() dto: CreateInitiativeDto
	) {
		const response = await this.communitiesClient.call('createInitiative', {
			communityId,
			userId,
			...dto,
			wholesaleTiers: dto.wholesaleTiers || []
		})

		await this.escrowClient.call('createEscrow', {
			initiativeId: response.initiative!.id,
			organizerUserId: userId
		})

		return response
	}

	@ApiBearerAuth()
	@Get()
	@Protected()
	@ApiOperation({ summary: 'List all initiatives in a community' })
	async listInitiatives(@Param('communityId') communityId: string) {
		return this.communitiesClient.call('listCommunityInitiatives', {
			communityId
		})
	}

	@ApiBearerAuth()
	@Get(':initiativeId')
	@Protected()
	@ApiOperation({ summary: 'Get a specific initiative' })
	async getInitiative(@Param('initiativeId') initiativeId: string) {
		return this.communitiesClient.call('getInitiative', {
			initiativeId
		})
	}
}
