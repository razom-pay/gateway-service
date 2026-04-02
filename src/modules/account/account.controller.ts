import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { CurrentUser, Protected } from 'src/shared/decorators'

import { AccountClientGrpc } from './account.grpc'
import {
	ConfirmEmailChangeRequest,
	ConfirmPhoneChangeRequest,
	InitEmailChangeRequest,
	InitPhoneChangeRequest
} from './dto'

@Controller('account')
export class AccountController {
	constructor(private readonly client: AccountClientGrpc) {}

	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Init email change',
		description: 'Sends confirmation code to a new email address.'
	})
	@Protected()
	@Post('email/init')
	@HttpCode(HttpStatus.OK)
	initEmailChange(
		@Body() dto: InitEmailChangeRequest,
		@CurrentUser() userId: string
	) {
		return this.client.initEmailChange({ ...dto, userId })
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Confirm email change',
		description: 'Verifies confirmation code and updates the email address.'
	})
	@Protected()
	@Post('email/confirm')
	@HttpCode(HttpStatus.OK)
	confirmEmailChange(
		@Body() dto: ConfirmEmailChangeRequest,
		@CurrentUser() userId: string
	) {
		return this.client.confirmEmailChange({ ...dto, userId })
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Init phone change',
		description: 'Sends confirmation code to a new phone number.'
	})
	@Protected()
	@Post('phone/init')
	@HttpCode(HttpStatus.OK)
	initPhoneChange(
		@Body() dto: InitPhoneChangeRequest,
		@CurrentUser() userId: string
	) {
		return this.client.initPhoneChange({ ...dto, userId })
	}

	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Confirm phone change',
		description: 'Verifies confirmation code and updates the phone number.'
	})
	@Protected()
	@Post('phone/confirm')
	@HttpCode(HttpStatus.OK)
	confirmPhoneChange(
		@Body() dto: ConfirmPhoneChangeRequest,
		@CurrentUser() userId: string
	) {
		return this.client.confirmPhoneChange({ ...dto, userId })
	}
}
