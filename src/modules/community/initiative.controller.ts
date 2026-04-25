import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiParam,
	ApiResponse
} from '@nestjs/swagger'

import { CurrentUser, Protected } from '../../shared/decorators'

import { InitiativeClientGrpc } from './initiative.grpc'
import {
	ContributeInitiativeRequest,
	CreateInitiativeRequest,
	InitiativeContributionResponse,
	InitiativeListResponse,
	InitiativeResponse,
	ListInitiativesQuery
} from './dto'

@ApiBearerAuth()
@Protected()
@Controller('communities/:communityId/initiatives')
export class InitiativeController {
	constructor(private readonly client: InitiativeClientGrpc) {}

	@ApiOperation({ summary: 'Create community initiative' })
	@ApiParam({ name: 'communityId', required: true })
	@ApiResponse({ status: HttpStatus.CREATED, type: InitiativeResponse })
	@Post()
	@HttpCode(HttpStatus.CREATED)
	createInitiative(
		@CurrentUser() userId: string,
		@Param('communityId') communityId: string,
		@Body() dto: CreateInitiativeRequest
	) {
		return this.client.call('createInitiative', {
			communityId,
			organizerUserId: userId,
			type: dto.type,
			title: dto.title,
			description: dto.description,
			deadlineAt: dto.deadlineAt,
			organizerFeeMinor: dto.organizerFeeMinor,
			currency: dto.currency ?? 'UAH',
			goalAmountMinor: dto.goalAmountMinor,
			crowdfundingRule: dto.crowdfundingRule,
			wholesaleRule: dto.wholesaleRule
		})
	}

	@ApiOperation({ summary: 'List initiatives in community' })
	@ApiParam({ name: 'communityId', required: true })
	@ApiResponse({ status: HttpStatus.OK, type: InitiativeListResponse })
	@Get()
	@HttpCode(HttpStatus.OK)
	listCommunityInitiatives(
		@CurrentUser() userId: string,
		@Param('communityId') communityId: string,
		@Query() query: ListInitiativesQuery
	) {
		return this.client.call('listCommunityInitiatives', {
			communityId,
			requesterUserId: userId,
			type: query.type,
			status: query.status
		})
	}

	@ApiOperation({ summary: 'Get initiative by id' })
	@ApiParam({ name: 'communityId', required: true })
	@ApiParam({ name: 'initiativeId', required: true })
	@ApiResponse({ status: HttpStatus.OK, type: InitiativeResponse })
	@Get(':initiativeId')
	@HttpCode(HttpStatus.OK)
	getInitiative(
		@Param('communityId') communityId: string,
		@Param('initiativeId') initiativeId: string
	) {
		return this.client.call('getInitiative', {
			communityId,
			initiativeId
		})
	}

	@ApiOperation({ summary: 'Contribute to initiative' })
	@ApiParam({ name: 'communityId', required: true })
	@ApiParam({ name: 'initiativeId', required: true })
	@ApiResponse({ status: HttpStatus.OK, type: InitiativeContributionResponse })
	@Post(':initiativeId/contributions')
	@HttpCode(HttpStatus.OK)
	contributeToInitiative(
		@CurrentUser() userId: string,
		@Param('communityId') communityId: string,
		@Param('initiativeId') initiativeId: string,
		@Body() dto: ContributeInitiativeRequest
	) {
		return this.client.call('contributeToInitiative', {
			communityId,
			initiativeId,
			contributorUserId: userId,
			amountMinor: dto.amountMinor,
			requestId: dto.requestId
		})
	}

	@ApiOperation({ summary: 'List my initiative contributions' })
	@ApiParam({ name: 'communityId', required: true })
	@ApiParam({ name: 'initiativeId', required: true })
	@ApiResponse({ status: HttpStatus.OK, type: [InitiativeContributionResponse] })
	@Get(':initiativeId/contributions/me')
	@HttpCode(HttpStatus.OK)
	listMyInitiativeContributions(
		@CurrentUser() userId: string,
		@Param('communityId') communityId: string,
		@Param('initiativeId') initiativeId: string
	) {
		return this.client.call('listMyInitiativeContributions', {
			communityId,
			initiativeId,
			userId
		})
	}

	@ApiOperation({ summary: 'Cancel initiative' })
	@ApiParam({ name: 'communityId', required: true })
	@ApiParam({ name: 'initiativeId', required: true })
	@ApiResponse({ status: HttpStatus.OK, type: InitiativeResponse })
	@Post(':initiativeId/cancel')
	@HttpCode(HttpStatus.OK)
	cancelInitiative(
		@CurrentUser() userId: string,
		@Param('communityId') communityId: string,
		@Param('initiativeId') initiativeId: string
	) {
		return this.client.call('cancelInitiative', {
			communityId,
			initiativeId,
			actorUserId: userId
		})
	}
}
