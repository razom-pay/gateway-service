import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Patch
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { CurrentUser, Protected } from '../../shared/decorators'

import { GetMeResponse, PatchUserRequest } from './dto'
import { UsersClientGrpc } from './users.grpc'

@Controller('users')
export class UsersController {
	constructor(private readonly client: UsersClientGrpc) {}

	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Get current user profile',
		description: 'Retuns authenticated user profile data.'
	})
	@ApiOkResponse({
		type: GetMeResponse
	})
	@Protected()
	@Get('@me')
	@HttpCode(HttpStatus.OK)
	async getMe(@CurrentUser() userId: string) {
		const { user } = await this.client.call('getMe', { id: userId })
		return user
	}

	@ApiBearerAuth()
	@Protected()
	@Patch('@me')
	@HttpCode(HttpStatus.OK)
	patchUser(@CurrentUser() userId: string, @Body() dto: PatchUserRequest) {
		return this.client.call('patchUser', { userId, ...dto })
	}
}
