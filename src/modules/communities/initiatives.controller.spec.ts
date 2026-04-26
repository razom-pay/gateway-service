import { Test, TestingModule } from '@nestjs/testing'
import { InitiativeType } from '@razom-pay/contracts/gen/communities'
import 'reflect-metadata'

import { AuthGuard } from '../../shared/guards/auth.guard'

import { CommunitiesClientGrpc } from './communities.grpc'
import { InitiativesController } from './initiatives.controller'

describe('InitiativesController', () => {
	let controller: InitiativesController
	let communitiesClient: jest.Mocked<CommunitiesClientGrpc>

	beforeEach(async () => {
		communitiesClient = {
			call: jest.fn()
		} as any

		const module: TestingModule = await Test.createTestingModule({
			controllers: [InitiativesController],
			providers: [
				{ provide: CommunitiesClientGrpc, useValue: communitiesClient }
			]
		})
			.overrideGuard(AuthGuard)
			.useValue({ canActivate: () => true })
			.compile()

		controller = module.get<InitiativesController>(InitiativesController)
	})

	describe('createInitiative', () => {
		it('should call CreateInitiative via gRPC', async () => {
			communitiesClient.call.mockResolvedValue({
				initiative: { id: 'init-1' }
			} as any)

			const dto = {
				title: 'Test',
				type: InitiativeType.INITIATIVE_TYPE_CROWDFUNDING,
				deadline: new Date().toISOString()
			}

			const result = await controller.createInitiative(
				'com-1',
				'u-1',
				dto
			)

			expect(communitiesClient.call).toHaveBeenCalledWith(
				'createInitiative',
				{
					communityId: 'com-1',
					userId: 'u-1',
					...dto,
					wholesaleTiers: []
				}
			)
			expect(result).toEqual({ initiative: { id: 'init-1' } })
		})
	})

	describe('listInitiatives', () => {
		it('should call ListCommunityInitiatives via gRPC', async () => {
			communitiesClient.call.mockResolvedValue({ initiatives: [] } as any)

			await controller.listInitiatives('com-1')

			expect(communitiesClient.call).toHaveBeenCalledWith(
				'listCommunityInitiatives',
				{
					communityId: 'com-1'
				}
			)
		})
	})

	describe('getInitiative', () => {
		it('should call GetInitiative via gRPC', async () => {
			communitiesClient.call.mockResolvedValue({
				initiative: { id: 'init-1' }
			} as any)

			await controller.getInitiative('init-1')

			expect(communitiesClient.call).toHaveBeenCalledWith(
				'getInitiative',
				{
					initiativeId: 'init-1'
				}
			)
		})
	})

	describe('contribute', () => {
		it('should call ContributeToInitiative via gRPC', async () => {
			communitiesClient.call.mockResolvedValue({
				contribution: { id: 'contrib-1' }
			} as any)

			await controller.contribute('init-1', 'u-1', { amount: 100 })

			expect(communitiesClient.call).toHaveBeenCalledWith(
				'contributeToInitiative',
				{
					initiativeId: 'init-1',
					userId: 'u-1',
					amount: 100
				}
			)
		})
	})
})
