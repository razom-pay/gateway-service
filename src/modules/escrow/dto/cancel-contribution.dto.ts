import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CancelContributionDto {
	@ApiProperty({
		description:
			'Escrow payment identifier returned by create payment call',
		example: 'payment_8A9jK1L2M3'
	})
	@IsString()
	@IsNotEmpty()
	paymentId!: string
}
