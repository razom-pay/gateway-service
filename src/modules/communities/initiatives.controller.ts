import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { CurrentUser } from '../../shared/decorators/current-user.decorator'
import { Protected } from '../../shared/decorators/protected.decorators'

import { CommunitiesClientGrpc } from './communities.grpc'
import {
	ContributeToInitiativeDto,
	CreateInitiativeDto
} from './dto/requests/initiatives.dto'

@ApiTags('Communities / Initiatives')
@Controller('communities/:communityId/initiatives')
export class InitiativesController {
	constructor(private readonly communitiesClient: CommunitiesClientGrpc) {}

	@ApiBearerAuth()
	@Post()
	@Protected()
	@ApiOperation({ summary: 'Create an initiative in a community' })
	async createInitiative(
		@Param('communityId') communityId: string,
		@CurrentUser() userId: string,
		@Body() dto: CreateInitiativeDto
	) {
		return this.communitiesClient.call('createInitiative', {
			communityId,
			userId,
			...dto,
			wholesaleTiers: dto.wholesaleTiers || []
		})
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

	@ApiBearerAuth()
	@Post(':initiativeId/contribute')
	@Protected()
	@ApiOperation({ summary: 'Contribute to an initiative' })
	async contribute(
		@Param('initiativeId') initiativeId: string,
		@CurrentUser() userId: string,
		@Body() dto: ContributeToInitiativeDto
	) {
		return this.communitiesClient.call('contributeToInitiative', {
			initiativeId,
			userId,
			amount: dto.amount
		})
	}
}
