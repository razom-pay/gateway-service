import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post
} from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiOkResponse,
	ApiOperation,
	ApiParam
} from '@nestjs/swagger'

import { CurrentUser, Protected } from '../../shared/decorators'

import { CommunityClientGrpc } from './community.grpc'
import {
	AssignRoleRequest,
	BanMemberRequest,
	CreateCommunityRequest,
	InviteMemberRequest,
	PatchCommunityRequest
} from './dto'

@Controller('communities')
export class CommunityController {
	constructor(private readonly client: CommunityClientGrpc) {}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'Create community' })
	@Protected()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	createCommunity(
		@CurrentUser() userId: string,
		@Body() dto: CreateCommunityRequest
	) {
		return this.client.call('createCommunity', {
			userId,
			...dto
		})
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'Patch community profile' })
	@ApiParam({ name: 'communityId', required: true })
	@Protected()
	@Patch(':communityId')
	@HttpCode(HttpStatus.OK)
	patchCommunity(
		@CurrentUser() userId: string,
		@Param('communityId') communityId: string,
		@Body() dto: PatchCommunityRequest
	) {
		return this.client.call('patchCommunity', {
			communityId,
			userId,
			...dto
		})
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'List my communities' })
	@Protected()
	@Get('my')
	@HttpCode(HttpStatus.OK)
	listMyCommunities(@CurrentUser() userId: string) {
		return this.client.call('listMyCommunities', { userId })
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get community by id' })
	@ApiParam({ name: 'communityId', required: true })
	@ApiOkResponse()
	@Protected()
	@Get(':communityId')
	@HttpCode(HttpStatus.OK)
	getCommunity(@Param('communityId') communityId: string) {
		return this.client.call('getCommunity', { communityId })
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'Join community' })
	@ApiParam({ name: 'communityId', required: true })
	@Protected()
	@Post(':communityId/join')
	@HttpCode(HttpStatus.OK)
	joinCommunity(
		@CurrentUser() userId: string,
		@Param('communityId') communityId: string
	) {
		return this.client.call('joinCommunity', { communityId, userId })
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'Leave community' })
	@ApiParam({ name: 'communityId', required: true })
	@Protected()
	@Post(':communityId/leave')
	@HttpCode(HttpStatus.OK)
	leaveCommunity(
		@CurrentUser() userId: string,
		@Param('communityId') communityId: string
	) {
		return this.client.call('leaveCommunity', { communityId, userId })
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'Invite user to community' })
	@ApiParam({ name: 'communityId', required: true })
	@Protected()
	@Post(':communityId/invites')
	@HttpCode(HttpStatus.OK)
	inviteMember(
		@CurrentUser() userId: string,
		@Param('communityId') communityId: string,
		@Body() dto: InviteMemberRequest
	) {
		return this.client.call('inviteMember', {
			communityId,
			invitedByUserId: userId,
			...dto
		})
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'Accept invite' })
	@Protected()
	@Post(':communityId/invites/:inviteId/accept')
	@HttpCode(HttpStatus.OK)
	acceptInvite(
		@CurrentUser() userId: string,
		@Param('communityId') communityId: string,
		@Param('inviteId') inviteId: string
	) {
		return this.client.call('acceptInvite', {
			communityId,
			inviteId,
			userId
		})
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'Decline invite' })
	@Protected()
	@Post(':communityId/invites/:inviteId/decline')
	@HttpCode(HttpStatus.OK)
	declineInvite(
		@CurrentUser() userId: string,
		@Param('communityId') communityId: string,
		@Param('inviteId') inviteId: string
	) {
		return this.client.call('declineInvite', {
			communityId,
			inviteId,
			userId
		})
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'Assign role to member' })
	@Protected()
	@Post(':communityId/members/:userId/role')
	@HttpCode(HttpStatus.OK)
	assignRole(
		@CurrentUser() currentUserId: string,
		@Param('communityId') communityId: string,
		@Param('userId') userId: string,
		@Body() dto: AssignRoleRequest
	) {
		return this.client.call('assignRole', {
			communityId,
			actorUserId: currentUserId,
			targetUserId: userId,
			role: dto.role
		})
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'Ban member' })
	@Protected()
	@Post(':communityId/members/:userId/ban')
	@HttpCode(HttpStatus.OK)
	banMember(
		@CurrentUser() currentUserId: string,
		@Param('communityId') communityId: string,
		@Param('userId') userId: string,
		@Body() dto: BanMemberRequest
	) {
		return this.client.call('banMember', {
			communityId,
			actorUserId: currentUserId,
			targetUserId: userId,
			...dto
		})
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'Unban member' })
	@Protected()
	@Delete(':communityId/members/:userId/ban')
	@HttpCode(HttpStatus.OK)
	unbanMember(
		@CurrentUser() currentUserId: string,
		@Param('communityId') communityId: string,
		@Param('userId') userId: string
	) {
		return this.client.call('unbanMember', {
			communityId,
			actorUserId: currentUserId,
			targetUserId: userId
		})
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: 'List community members' })
	@Protected()
	@Get(':communityId/members')
	@HttpCode(HttpStatus.OK)
	listMembers(
		@CurrentUser() userId: string,
		@Param('communityId') communityId: string
	) {
		return this.client.call('listCommunityMembers', {
			communityId,
			requesterUserId: userId
		})
	}
}
