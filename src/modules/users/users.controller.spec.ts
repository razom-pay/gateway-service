import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersClientGrpc } from './users.grpc'
import { PatchUserRequest } from './dto'

import { AuthGuard } from '../../shared/guards/auth.guard'

describe('UsersController', () => {
	let controller: UsersController
	let usersClientGrpc: jest.Mocked<UsersClientGrpc>

	beforeEach(async () => {
		const mockUsersClientGrpc = {
			call: jest.fn()
		}

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{
					provide: UsersClientGrpc,
					useValue: mockUsersClientGrpc
				}
			]
		})
			.overrideGuard(AuthGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<UsersController>(UsersController)
		usersClientGrpc = module.get(UsersClientGrpc)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('getMe', () => {
		it('should return user from client.call', async () => {
			const userId = 'test-user-id'
			const mockUser = { id: userId, email: 'test@example.com' }
			usersClientGrpc.call.mockResolvedValue({ user: mockUser })

			const result = await controller.getMe(userId)

			expect(usersClientGrpc.call).toHaveBeenCalledWith('getMe', { id: userId })
			expect(result).toEqual(mockUser)
		})
	})

	describe('patchUser', () => {
		it('should call patchUser and return result', async () => {
			const userId = 'test-user-id'
			const dto: PatchUserRequest = { name: 'New Name' }
			const mockResult = { ok: true }
			usersClientGrpc.call.mockResolvedValue(mockResult)

			const result = await controller.patchUser(userId, dto)

			expect(usersClientGrpc.call).toHaveBeenCalledWith('patchUser', {
				userId,
				...dto
			})
			expect(result).toEqual(mockResult)
		})
	})
})
