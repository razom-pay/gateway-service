import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches } from 'class-validator'

export class InitPhoneChangeRequest {
	@ApiProperty({
		example: '+380951234567'
	})
	@IsNotEmpty()
	@Matches(/^\+?[1-9]\d{9,14}$/)
	phone: string
}
