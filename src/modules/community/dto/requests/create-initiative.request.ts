import { Type } from 'class-transformer'
import {
	IsEnum,
	IsISO8601,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	ValidateNested
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { InitiativeType } from '@razom-pay/contracts/gen/community'

import { CreateCrowdfundingConfigRequest } from './create-crowdfunding-config.request'
import { CreateWholesaleConfigRequest } from './create-wholesale-config.request'

export class CreateInitiativeRequest {
	@ApiProperty({
		enum: InitiativeType,
		example: InitiativeType.INITIATIVE_TYPE_CROWDFUNDING
	})
	@IsEnum(InitiativeType)
	type!: InitiativeType

	@ApiProperty({ example: 'Support New Equipment Purchase' })
	@IsString()
	@IsNotEmpty()
	title!: string

	@ApiProperty({ example: 'Fundraising for new wholesale inventory' })
	@IsString()
	@IsNotEmpty()
	description!: string

	@ApiProperty({ example: '2026-06-01T12:00:00.000Z' })
	@IsISO8601()
	deadlineAt!: string

	@ApiProperty({ example: '5000000' })
	@Matches(/^[0-9]+$/)
	organizerFeeMinor!: string

	@ApiPropertyOptional({ example: 'UAH', default: 'UAH' })
	@IsOptional()
	@IsString()
	currency?: string

	@ApiPropertyOptional({ example: '50000000' })
	@IsOptional()
	@Matches(/^[0-9]+$/)
	goalAmountMinor?: string

	@ApiPropertyOptional({ type: CreateCrowdfundingConfigRequest })
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateCrowdfundingConfigRequest)
	crowdfundingRule?: CreateCrowdfundingConfigRequest

	@ApiPropertyOptional({ type: CreateWholesaleConfigRequest })
	@IsOptional()
	@ValidateNested()
	@Type(() => CreateWholesaleConfigRequest)
	wholesaleRule?: CreateWholesaleConfigRequest
}
