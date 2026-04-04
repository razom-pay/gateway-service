import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiOperation } from '@nestjs/swagger'
import type { Request, Response } from 'express'
import { lastValueFrom } from 'rxjs'

import { AuthClientGrpc } from './auth.grpc'
import {
	SendOtpRequest,
	TelegramFinalizeRequest,
	TelegramVerifyRequest
} from './dto'
import { VerifyOtpRequest } from './dto'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly client: AuthClientGrpc,
		private readonly configService: ConfigService
	) {}

	@ApiOperation({
		summary: 'Send OTP code',
		description: 'Sends verification code to the user email or phone.'
	})
	@Post('otp/send')
	@HttpCode(HttpStatus.OK)
	sendOtp(@Body() dto: SendOtpRequest) {
		return this.client.sendOtp(dto)
	}

	@ApiOperation({
		summary: 'Verify OTP code',
		description:
			'Verifies the code sent to the user email or phone and returns a access token.'
	})
	@Post('otp/Verify')
	@HttpCode(HttpStatus.OK)
	async VerifyOtp(
		@Body() dto: VerifyOtpRequest,
		@Res({ passthrough: true }) res: Response
	) {
		const { accessToken, refreshToken } = await lastValueFrom(
			this.client.verifyOtp(dto)
		)

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: this.configService.get('NODE_ENV') !== 'development',
			domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
		})

		return { accessToken }
	}

	@ApiOperation({
		summary: 'Refresh access token',
		description:
			'Refreshes the access token using the refresh token stored in cookies.'
	})
	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshToken = req.cookies?.refreshToken as string

		const { accessToken, refreshToken: newRefreshToken } =
			await lastValueFrom(this.client.refresh({ refreshToken }))

		res.cookie('refreshToken', newRefreshToken, {
			httpOnly: true,
			secure: this.configService.get('NODE_ENV') !== 'development',
			domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
		})

		return { accessToken }
	}

	@ApiOperation({
		summary: 'Logout',
		description: 'Clears the refresh token cookie to log the user out.'
	})
	@Post('logout')
	@HttpCode(HttpStatus.OK)
	logout(@Res({ passthrough: true }) res: Response) {
		res.cookie('refreshToken', '', {
			httpOnly: true,
			secure: this.configService.get('NODE_ENV') !== 'development',
			domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
			sameSite: 'lax',
			expires: new Date(0)
		})
		return { ok: true }
	}

	@Get('telegram')
	@HttpCode(HttpStatus.OK)
	telegramInit() {
		return this.client.telegramInit()
	}

	@Post('telegram/verify')
	@HttpCode(HttpStatus.OK)
	async telegramVerify(
		@Body() dto: TelegramVerifyRequest,
		@Res({ passthrough: true }) res: Response
	) {
		const query = JSON.parse(atob(dto.tgAuthResult)) as {
			[key: string]: string
		}

		const result = await lastValueFrom(
			this.client.telegramVerify({ query })
		)

		if ('url' in result && result.url) return result

		if (result.accessToken && result.refreshToken) {
			const { accessToken, refreshToken } = result

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				secure: this.configService.get('NODE_ENV') !== 'development',
				domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
				sameSite: 'lax',
				maxAge: 30 * 24 * 60 * 60 * 1000
			})

			return { accessToken }
		}

		throw new Error('Invalid Telegram login response')
	}

	@Post('telegram/finalize')
	@HttpCode(HttpStatus.OK)
	async finalizeTelegramLogin(
		@Body() dto: TelegramFinalizeRequest,
		@Res({ passthrough: true }) res: Response
	) {
		const { sessionId } = dto
		const { accessToken, refreshToken } = await lastValueFrom(
			this.client.telegramConsume({ sessionId })
		)

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: this.configService.get('NODE_ENV') !== 'development',
			domain: this.configService.getOrThrow<string>('COOKIES_DOMAIN'),
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60 * 1000
		})

		return { accessToken }
	}
}
