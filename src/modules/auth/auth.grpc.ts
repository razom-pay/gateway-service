import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import type {
	AuthServiceClient,
	RefreshRequest,
	SendOtpRequest,
	TelegramConsumeRequest,
	TelegramVerifyRequest,
	VerifyOtpRequest
} from '@razom-pay/contracts/gen/auth'

@Injectable()
export class AuthClientGrpc implements OnModuleInit {
	private authService!: AuthServiceClient

	constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

	onModuleInit() {
		this.authService =
			this.client.getService<AuthServiceClient>('AuthService')
	}

	sendOtp(request: SendOtpRequest) {
		return this.authService.sendOtp(request)
	}

	verifyOtp(request: VerifyOtpRequest) {
		return this.authService.verifyOtp(request)
	}

	refresh(request: RefreshRequest) {
		return this.authService.refresh(request)
	}

	telegramInit() {
		return this.authService.telegramInit({})
	}

	telegramVerify(request: TelegramVerifyRequest) {
		return this.authService.telegramVerify(request)
	}

	telegramConsume(request: TelegramConsumeRequest) {
		return this.authService.telegramConsume(request)
	}
}
