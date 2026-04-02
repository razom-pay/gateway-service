import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import type {
	AccountServiceClient,
	ConfirmEmailChangeRequest,
	ConfirmPhoneChangeRequest,
	GetAccountRequest,
	InitEmailChangeRequest,
	InitPhoneChangeRequest
} from '@razom-pay/contracts/gen/account'

@Injectable()
export class AccountClientGrpc implements OnModuleInit {
	private accountService: AccountServiceClient

	constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

	onModuleInit() {
		this.accountService =
			this.client.getService<AccountServiceClient>('AccountService')
	}

	getAccount(request: GetAccountRequest) {
		return this.accountService.getAccount(request)
	}

	initEmailChange(request: InitEmailChangeRequest) {
		return this.accountService.initEmailChange(request)
	}

	confirmEmailChange(request: ConfirmEmailChangeRequest) {
		return this.accountService.confirmEmailChange(request)
	}

	initPhoneChange(request: InitPhoneChangeRequest) {
		return this.accountService.initPhoneChange(request)
	}

	confirmPhoneChange(request: ConfirmPhoneChangeRequest) {
		return this.accountService.confirmPhoneChange(request)
	}
}
