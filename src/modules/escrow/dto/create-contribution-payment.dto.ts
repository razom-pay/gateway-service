import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min
} from 'class-validator'

export class CreateContributionPaymentDto {
	@ApiProperty({
		description: 'Contribution amount in kopiiky',
		example: 500000
	})
	@IsNumber()
	@Min(1)
	amount!: number

	@ApiPropertyOptional({
		description: 'Client-provided idempotency key for safe retries',
		example: 'bfbf7649-1e8a-49f0-8ca4-b8cf5a5ad3c1'
	})
	@IsString()
	@IsNotEmpty()
	@IsOptional()
	idempotencyKey?: string
}
