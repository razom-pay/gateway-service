import 'reflect-metadata'

import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'

import { InitiativeController } from '../src/modules/community/initiative.controller'
import { InitiativeClientGrpc } from '../src/modules/community/initiative.grpc'
import {
	ContributeInitiativeRequest,
	CreateInitiativeRequest,
	ListInitiativesQuery
} from '../src/modules/community/dto'

describe('Community initiative endpoints (e2e)', () => {
	const client = {
		call: jest.fn().mockResolvedValue({})
	} as unknown as InitiativeClientGrpc

	const controller = new InitiativeController(client)

	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('creates initiative for crowdfunding and wholesale payloads', async () => {
		await controller.createInitiative('user-1', 'community-1', {
			type: 1,
			title: 'Crowdfunding initiative',
			description: 'Description',
			deadlineAt: '2026-12-31T12:00:00.000Z',
			organizerFeeMinor: '1000',
			currency: 'UAH',
			goalAmountMinor: '100000',
			crowdfundingRule: {
				ruleType: 1
			}
		} as CreateInitiativeRequest)

		await controller.createInitiative('user-2', 'community-1', {
			type: 2,
			title: 'Wholesale initiative',
			description: 'Description',
			deadlineAt: '2026-12-31T12:00:00.000Z',
			organizerFeeMinor: '1000',
			currency: 'UAH',
			wholesaleRule: {
				minSuccessUnits: 50,
				maxUnits: 300,
				tiers: [
					{ minUnits: 50, unitPriceMinor: '30000' },
					{ minUnits: 75, unitPriceMinor: '28000' }
				]
			}
		} as CreateInitiativeRequest)

		expect((client.call as jest.Mock).mock.calls[0][0]).toBe(
			'createInitiative'
		)
		expect((client.call as jest.Mock).mock.calls[0][1]).toEqual(
			expect.objectContaining({
				communityId: 'community-1',
				organizerUserId: 'user-1',
				type: 1
			})
		)
		expect((client.call as jest.Mock).mock.calls[1][1]).toEqual(
			expect.objectContaining({
				organizerUserId: 'user-2',
				type: 2
			})
		)
	})

	it('accepts valid contribution payload and rejects invalid payload', async () => {
		const invalid = plainToInstance(ContributeInitiativeRequest, {
			amountMinor: 'invalid',
			requestId: ''
		})
		const invalidErrors = validateSync(invalid)
		expect(invalidErrors.length).toBeGreaterThan(0)

		await controller.contributeToInitiative(
			'user-3',
			'community-1',
			'initiative-1',
			{
				amountMinor: '60000',
				requestId: 'req-1'
			} as ContributeInitiativeRequest
		)

		expect((client.call as jest.Mock).mock.calls[0]).toEqual([
			'contributeToInitiative',
			expect.objectContaining({
				communityId: 'community-1',
				initiativeId: 'initiative-1',
				contributorUserId: 'user-3',
				amountMinor: '60000',
				requestId: 'req-1'
			})
		])
	})

	it('reads initiative list/item and own contributions', async () => {
		await controller.listCommunityInitiatives(
			'user-1',
			'community-1',
			{ type: 1 } as ListInitiativesQuery
		)
		await controller.getInitiative('community-1', 'initiative-1')
		await controller.listMyInitiativeContributions(
			'user-1',
			'community-1',
			'initiative-1'
		)

		expect((client.call as jest.Mock).mock.calls[0]).toEqual([
			'listCommunityInitiatives',
			expect.objectContaining({
				communityId: 'community-1',
				requesterUserId: 'user-1',
				type: 1
			})
		])
		expect((client.call as jest.Mock).mock.calls[1]).toEqual([
			'getInitiative',
			{ communityId: 'community-1', initiativeId: 'initiative-1' }
		])
		expect((client.call as jest.Mock).mock.calls[2]).toEqual([
			'listMyInitiativeContributions',
			{
				communityId: 'community-1',
				initiativeId: 'initiative-1',
				userId: 'user-1'
			}
		])
	})

	it('sends cancel requests for organizer/owner authorization matrix', async () => {
		await controller.cancelInitiative('organizer-1', 'community-1', 'initiative-1')
		await controller.cancelInitiative('owner-1', 'community-1', 'initiative-1')

		expect((client.call as jest.Mock).mock.calls[0]).toEqual([
			'cancelInitiative',
			{
				communityId: 'community-1',
				initiativeId: 'initiative-1',
				actorUserId: 'organizer-1'
			}
		])
		expect((client.call as jest.Mock).mock.calls[1]).toEqual([
			'cancelInitiative',
			{
				communityId: 'community-1',
				initiativeId: 'initiative-1',
				actorUserId: 'owner-1'
			}
		])

		const classGuards = Reflect.getMetadata('__guards__', InitiativeController)
		expect(classGuards).toBeDefined()
	})
})
