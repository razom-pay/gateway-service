import { Type } from 'class-transformer'
import {
	ArrayMinSize,
	IsArray,
	IsInt,
	Matches,
	Min,
	Validate,
	ValidateNested,
	ValidatorConstraint,
	type ValidatorConstraintInterface
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

class CreateWholesaleTierRequest {
	@ApiProperty({ example: 50 })
	@IsInt()
	@Min(1)
	minUnits!: number

	@ApiProperty({ example: '30000' })
	@Matches(/^[0-9]+$/)
	unitPriceMinor!: string
}

@ValidatorConstraint({ name: 'WholesaleTiersSortedUnique', async: false })
class WholesaleTiersSortedUniqueConstraint
	implements ValidatorConstraintInterface
{
	validate(tiers: CreateWholesaleTierRequest[]) {
		if (!Array.isArray(tiers) || tiers.length === 0) return false

		for (let index = 1; index < tiers.length; index += 1) {
			const previous = tiers[index - 1]
			const current = tiers[index]
			if (current.minUnits <= previous.minUnits) return false
		}

		return true
	}

	defaultMessage() {
		return 'tiers must be sorted by minUnits ascending and contain unique minUnits'
	}
}

export class CreateWholesaleConfigRequest {
	@ApiProperty({ example: 50 })
	@IsInt()
	@Min(1)
	minSuccessUnits!: number

	@ApiProperty({ example: 300 })
	@IsInt()
	@Min(1)
	maxUnits!: number

	@ApiProperty({
		type: [CreateWholesaleTierRequest],
		example: [
			{ minUnits: 50, unitPriceMinor: '30000' },
			{ minUnits: 75, unitPriceMinor: '28000' },
			{ minUnits: 100, unitPriceMinor: '27000' }
		]
	})
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateWholesaleTierRequest)
	@Validate(WholesaleTiersSortedUniqueConstraint)
	tiers!: CreateWholesaleTierRequest[]
}
