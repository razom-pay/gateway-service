import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { InitiativeType } from '@razom-pay/contracts/gen/communities'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator'

export class WholesaleTierDto {
	@ApiProperty({ description: 'Minimum quantity for this tier' })
	@IsNumber()
	minQuantity!: number

	@ApiProperty({ description: 'Price in kopiiky' })
	@IsNumber()
	price!: number
}

export class CreateInitiativeDto {
	@ApiProperty({
		example: 'Buy generator or wholesale anything for community'
	})
	@IsString()
	title!: string

	@ApiPropertyOptional({
		example:
			'We need to buy a generator for our community center to provide electricity during outages.' +
			'(Or) I offer to buy wholesale pillow for us, the dormitory residents.'
	})
	@IsString()
	@IsOptional()
	description?: string

	@ApiProperty({
		enum: InitiativeType,
		example: InitiativeType.INITIATIVE_TYPE_CROWDFUNDING
	})
	@IsEnum(InitiativeType)
	type!: InitiativeType

	@ApiProperty({
		description: 'ISO date string',
		example: '2048-12-31'
	})
	@IsString()
	deadline!: string

	@ApiPropertyOptional({
		description: 'Target amount in kopiiky (for CROWDFUNDING)',
		example: 50000000
	})
	@IsNumber()
	@IsOptional()
	targetAmount?: number

	@ApiPropertyOptional({
		description: 'Minimum contribution in kopiiky (for CROWDFUNDING)',
		example: 1
	})
	@IsNumber()
	@IsOptional()
	minContribution?: number

	@ApiPropertyOptional({
		description: 'Maximum contribution in kopiiky (for CROWDFUNDING)',
		example: 50000000
	})
	@IsNumber()
	@IsOptional()
	maxContribution?: number

	@ApiPropertyOptional({
		description: 'Exact contribution in kopiiky (for CROWDFUNDING)',
		example: 1000000
	})
	@IsNumber()
	@IsOptional()
	exactContribution?: number

	@ApiPropertyOptional({
		description: 'Maximum total quantity (for WHOLESALE)',
		example: 1000
	})
	@IsNumber()
	@IsOptional()
	wholesaleMaxQuantity?: number

	@ApiPropertyOptional({
		type: [WholesaleTierDto],
		description: 'Tiers (for WHOLESALE)',
		example: [
			{ minQuantity: 30, price: 30000 },
			{ minQuantity: 50, price: 28000 },
			{ minQuantity: 70, price: 26000 },
			{ minQuantity: 100, price: 25000 },
			{ minQuantity: 500, price: 24500 }
		]
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => WholesaleTierDto)
	@IsOptional()
	wholesaleTiers?: WholesaleTierDto[]
}

export class ContributeToInitiativeDto {
	@ApiProperty({ description: 'Amount in kopiiky', example: 1000000 })
	@IsNumber()
	amount!: number
}
