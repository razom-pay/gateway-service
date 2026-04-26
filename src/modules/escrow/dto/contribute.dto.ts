import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, Min } from 'class-validator'

export class ContributeDto {
	@ApiProperty({ description: 'Amount in kopiiky', example: 500000 })
	@IsNumber()
	@Min(1)
	amount!: number
}
