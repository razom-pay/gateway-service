import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { AuthController } from './auth.controller'
import { AuthClientGrpc } from './auth.grpc'
import type { Response, Request } from 'express'
import {
	SendOtpRequest,
	TelegramFinalizeRequest,
	TelegramVerifyRequest,
	VerifyOtpRequest
} from './dto'

describe('AuthController', () => {
	let controller: AuthController
	let authClientGrpc: jest.Mocked<AuthClientGrpc>
	let configService: jest.Mocked<ConfigService>

	const mockResponse = () => {
		const res: Partial<Response> = {}
		res.cookie = jest.fn().mockReturnValue(res)
		return res as Response
	}

	const mockRequest = (cookies = {}) => {
		const req: Partial<Request> = { cookies }
		return req as Request
	}

	beforeEach(async () => {
		const mockAuthClientGrpc = {
			call: jest.fn()
		}

		const mockConfigService = {
			get: jest.fn(),
			getOrThrow: jest.fn()
		}

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthClientGrpc,
					useValue: mockAuthClientGrpc
				},
				{
					provide: ConfigService,
					useValue: mockConfigService
				}
			]
		}).compile()

		controller = module.get<AuthController>(AuthController)
		authClientGrpc = module.get(AuthClientGrpc)
		configService = module.get(ConfigService)

		configService.get.mockImplementation((key: string) => {
			if (key === 'NODE_ENV') return 'production'
			return null
		})

		configService.getOrThrow.mockImplementation((key: string) => {
			if (key === 'COOKIES_DOMAIN') return '.razom-pay.com'
			throw new Error(`Unexpected config key: ${key}`)
		})
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('sendOtp', () => {
		it('should call authClientGrpc.call with sendOtp and correct dto', async () => {
			const dto: SendOtpRequest = { identifier: 'test@test.com', type: 'email' }
			authClientGrpc.call.mockResolvedValue({ ok: true })

			const result = await controller.sendOtp(dto)

			expect(authClientGrpc.call).toHaveBeenCalledWith('sendOtp', dto)
			expect(result).toEqual({ ok: true })
		})
	})

	describe('VerifyOtp', () => {
		it('should verify OTP, set cookie and return access token', async () => {
			const dto: VerifyOtpRequest = {
				identifier: 'test@test.com',
				type: 'email',
				code: '123456'
			}
			const mockRes = mockResponse()

			authClientGrpc.call.mockResolvedValue({
				accessToken: 'access-token',
				refreshToken: 'refresh-token'
			})

			const result = await controller.VerifyOtp(dto, mockRes)

			expect(authClientGrpc.call).toHaveBeenCalledWith('verifyOtp', dto)
			expect(mockRes.cookie).toHaveBeenCalledWith(
				'refreshToken',
				'refresh-token',
				expect.objectContaining({
					httpOnly: true,
					secure: true,
					domain: '.razom-pay.com',
					sameSite: 'lax'
				})
			)
			expect(result).toEqual({ accessToken: 'access-token' })
		})
	})

	describe('refresh', () => {
		it('should refresh tokens, set cookie and return new access token', async () => {
			const mockReq = mockRequest({ refreshToken: 'old-refresh-token' })
			const mockRes = mockResponse()

			authClientGrpc.call.mockResolvedValue({
				accessToken: 'new-access-token',
				refreshToken: 'new-refresh-token'
			})

			const result = await controller.refresh(mockReq, mockRes)

			expect(authClientGrpc.call).toHaveBeenCalledWith('refresh', {
				refreshToken: 'old-refresh-token'
			})
			expect(mockRes.cookie).toHaveBeenCalledWith(
				'refreshToken',
				'new-refresh-token',
				expect.objectContaining({
					httpOnly: true,
					secure: true,
					domain: '.razom-pay.com'
				})
			)
			expect(result).toEqual({ accessToken: 'new-access-token' })
		})
	})

	describe('logout', () => {
		it('should clear refresh token cookie', () => {
			const mockRes = mockResponse()

			const result = controller.logout(mockRes)

			expect(mockRes.cookie).toHaveBeenCalledWith(
				'refreshToken',
				'',
				expect.objectContaining({
					expires: new Date(0)
				})
			)
			expect(result).toEqual({ ok: true })
		})
	})

	describe('telegramInit', () => {
		it('should call telegramInit', async () => {
			authClientGrpc.call.mockResolvedValue({ ok: true })
			const result = await controller.telegramInit()

			expect(authClientGrpc.call).toHaveBeenCalledWith('telegramInit', {})
			expect(result).toEqual({ ok: true })
		})
	})

	describe('telegramVerify', () => {
		it('should verify telegram and return url if exists', async () => {
			const queryData = { id: '123', first_name: 'Test' }
			const dto: TelegramVerifyRequest = {
				tgAuthResult: btoa(JSON.stringify(queryData))
			}
			const mockRes = mockResponse()

			authClientGrpc.call.mockResolvedValue({
				url: 'https://example.com'
			})

			const result = await controller.telegramVerify(dto, mockRes)

			expect(authClientGrpc.call).toHaveBeenCalledWith('telegramVerify', {
				query: queryData
			})
			expect(result).toEqual({ url: 'https://example.com' })
		})

		it('should verify telegram, set cookie and return tokens if url does not exist', async () => {
			const queryData = { id: '123', first_name: 'Test' }
			const dto: TelegramVerifyRequest = {
				tgAuthResult: btoa(JSON.stringify(queryData))
			}
			const mockRes = mockResponse()

			authClientGrpc.call.mockResolvedValue({
				accessToken: 'access-token',
				refreshToken: 'refresh-token'
			})

			const result = await controller.telegramVerify(dto, mockRes)

			expect(mockRes.cookie).toHaveBeenCalledWith(
				'refreshToken',
				'refresh-token',
				expect.any(Object)
			)
			expect(result).toEqual({ accessToken: 'access-token' })
		})

		it('should throw error if invalid response', async () => {
			const queryData = { id: '123', first_name: 'Test' }
			const dto: TelegramVerifyRequest = {
				tgAuthResult: btoa(JSON.stringify(queryData))
			}
			const mockRes = mockResponse()

			authClientGrpc.call.mockResolvedValue({}) // Invalid response

			await expect(controller.telegramVerify(dto, mockRes)).rejects.toThrow(
				'Invalid Telegram login response'
			)
		})
	})

	describe('finalizeTelegramLogin', () => {
		it('should finalize login, set cookie and return access token', async () => {
			const dto: TelegramFinalizeRequest = {
				sessionId: 'session-id'
			}
			const mockRes = mockResponse()

			authClientGrpc.call.mockResolvedValue({
				accessToken: 'access-token',
				refreshToken: 'refresh-token'
			})

			const result = await controller.finalizeTelegramLogin(dto, mockRes)

			expect(authClientGrpc.call).toHaveBeenCalledWith('telegramConsume', dto)
			expect(mockRes.cookie).toHaveBeenCalledWith(
				'refreshToken',
				'refresh-token',
				expect.any(Object)
			)
			expect(result).toEqual({ accessToken: 'access-token' })
		})
	})
})
