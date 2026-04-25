import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

class InitiativeCrowdfundingRuleResponse {
	@ApiProperty({ example: 1 })
	ruleType!: number

	@ApiPropertyOptional({ example: '10000' })
	minAmountMinor?: string

	@ApiPropertyOptional({ example: '50000' })
	fixedAmountMinor?: string

	@ApiPropertyOptional({ example: '100000' })
	maxAmountMinor?: string
}

class InitiativeWholesaleTierResponse {
	@ApiProperty({ example: 50 })
	minUnits!: number

	@ApiProperty({ example: '30000' })
	unitPriceMinor!: string
}

class InitiativeWholesaleRuleResponse {
	@ApiProperty({ example: 50 })
	minSuccessUnits!: number

	@ApiProperty({ example: 300 })
	maxUnits!: number

	@ApiProperty({ type: [InitiativeWholesaleTierResponse] })
	tiers!: InitiativeWholesaleTierResponse[]
}

export class InitiativeResponse {
	@ApiProperty({ example: 'aBc123' })
	id!: string

	@ApiProperty({ example: 'community_1' })
	communityId!: string

	@ApiProperty({ example: 'user_organizer_1' })
	organizerUserId!: string

	@ApiProperty({ example: 1 })
	type!: number

	@ApiProperty({ example: 1 })
	status!: number

	@ApiProperty({ example: 'Support New Equipment Purchase' })
	title!: string

	@ApiProperty({ example: 'Fundraising for new wholesale inventory' })
	description!: string

	@ApiProperty({ example: 'UAH' })
	currency!: string

	@ApiProperty({ example: '5000000' })
	organizerFeeMinor!: string

	@ApiPropertyOptional({ example: '50000000' })
	goalAmountMinor?: string

	@ApiProperty({ example: '15000000' })
	collectedAmountMinor!: string

	@ApiProperty({ example: 50 })
	collectedUnits!: number

	@ApiProperty({ example: '2026-06-01T12:00:00.000Z' })
	deadlineAt!: string

	@ApiPropertyOptional({ type: InitiativeCrowdfundingRuleResponse })
	crowdfundingRule?: InitiativeCrowdfundingRuleResponse

	@ApiPropertyOptional({ type: InitiativeWholesaleRuleResponse })
	wholesaleRule?: InitiativeWholesaleRuleResponse

	@ApiPropertyOptional({ example: 1 })
	settlementOutcome?: number

	@ApiProperty({ example: '2026-04-25T12:00:00.000Z' })
	createdAt!: string

	@ApiProperty({ example: '2026-04-25T12:00:00.000Z' })
	updatedAt!: string
}
