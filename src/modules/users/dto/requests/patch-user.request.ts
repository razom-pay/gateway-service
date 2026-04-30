import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class PatchUserRequest {
	@ApiProperty({
		example: 'Kyrylo Lytvishko'
	})
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	name?: string

	@ApiProperty({
		example: 'acct_1QeKQfAAbbCCDDEE',
		required: false,
		description: 'Stripe connected account id for organizer payouts'
	})
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	stripeAccountId?: string
}
