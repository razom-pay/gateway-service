import { ApiProperty } from '@nestjs/swagger'

export class InitiativeContributionResponse {
	@ApiProperty({ example: 'nXf4a1' })
	id!: string

	@ApiProperty({ example: 'aBc123' })
	initiativeId!: string

	@ApiProperty({ example: 'u_123' })
	contributorUserId!: string

	@ApiProperty({ example: 'req-initiative-contribution-1' })
	requestId!: string

	@ApiProperty({ example: '60000' })
	amountMinor!: string

	@ApiProperty({ example: 2 })
	units!: number

	@ApiProperty({ example: 1 })
	status!: number

	@ApiProperty({ example: '54000' })
	capturedAmountMinor!: string

	@ApiProperty({ example: '6000' })
	refundedAmountMinor!: string

	@ApiProperty({ example: '2026-04-25T12:00:00.000Z' })
	createdAt!: string

	@ApiProperty({ example: '2026-04-25T12:00:00.000Z' })
	updatedAt!: string
}
