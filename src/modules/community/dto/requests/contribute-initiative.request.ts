import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class ContributeInitiativeRequest {
	@ApiProperty({ example: '60000' })
	@Matches(/^[0-9]+$/)
	amountMinor!: string

	@ApiProperty({ example: 'req-initiative-contribution-1' })
	@IsString()
	@IsNotEmpty()
	requestId!: string
}
