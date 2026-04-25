import { Test, TestingModule } from '@nestjs/testing'
import { AccountController } from './account.controller'
import { AccountClientGrpc } from './account.grpc'
import {
	ConfirmEmailChangeRequest,
	ConfirmPhoneChangeRequest,
	InitEmailChangeRequest,
	InitPhoneChangeRequest
} from './dto'
import { AuthGuard } from '../../shared/guards/auth.guard'

describe('AccountController', () => {
	let controller: AccountController
	let accountClientGrpc: jest.Mocked<AccountClientGrpc>

	beforeEach(async () => {
		const mockAccountClientGrpc = {
			call: jest.fn()
		}

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccountController],
			providers: [
				{
					provide: AccountClientGrpc,
					useValue: mockAccountClientGrpc
				}
			]
		})
			.overrideGuard(AuthGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<AccountController>(AccountController)
		accountClientGrpc = module.get(AccountClientGrpc)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('initEmailChange', () => {
		it('should call initEmailChange', async () => {
			const dto: InitEmailChangeRequest = { email: 'new@example.com' }
			const userId = 'user-123'
			const mockResult = { ok: true }
			accountClientGrpc.call.mockResolvedValue(mockResult)

			const result = await controller.initEmailChange(dto, userId)

			expect(accountClientGrpc.call).toHaveBeenCalledWith('initEmailChange', {
				...dto,
				userId
			})
			expect(result).toEqual(mockResult)
		})
	})

	describe('confirmEmailChange', () => {
		it('should call confirmEmailChange', async () => {
			const dto: ConfirmEmailChangeRequest = {
				email: 'new@example.com',
				code: '123456'
			}
			const userId = 'user-123'
			const mockResult = { ok: true }
			accountClientGrpc.call.mockResolvedValue(mockResult)

			const result = await controller.confirmEmailChange(dto, userId)

			expect(accountClientGrpc.call).toHaveBeenCalledWith(
				'confirmEmailChange',
				{
					...dto,
					userId
				}
			)
			expect(result).toEqual(mockResult)
		})
	})

	describe('initPhoneChange', () => {
		it('should call initPhoneChange', async () => {
			const dto: InitPhoneChangeRequest = { phone: '+380951234567' }
			const userId = 'user-123'
			const mockResult = { ok: true }
			accountClientGrpc.call.mockResolvedValue(mockResult)

			const result = await controller.initPhoneChange(dto, userId)

			expect(accountClientGrpc.call).toHaveBeenCalledWith('initPhoneChange', {
				...dto,
				userId
			})
			expect(result).toEqual(mockResult)
		})
	})

	describe('confirmPhoneChange', () => {
		it('should call confirmPhoneChange', async () => {
			const dto: ConfirmPhoneChangeRequest = {
				phone: '+380951234567',
				code: '123456'
			}
			const userId = 'user-123'
			const mockResult = { ok: true }
			accountClientGrpc.call.mockResolvedValue(mockResult)

			const result = await controller.confirmPhoneChange(dto, userId)

			expect(accountClientGrpc.call).toHaveBeenCalledWith(
				'confirmPhoneChange',
				{
					...dto,
					userId
				}
			)
			expect(result).toEqual(mockResult)
		})
	})
})
