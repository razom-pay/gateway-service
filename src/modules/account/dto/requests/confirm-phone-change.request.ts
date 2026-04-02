import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString, Length, Matches } from 'class-validator'

export class ConfirmPhoneChangeRequest {
	@ApiProperty({
		example: 'phone@example.com'
	})
	@IsNotEmpty()
	@Matches(/^\+?[1-9]\d{9,14}$/)
	phone: string

	@ApiProperty({
		example: '123456'
	})
	@IsNotEmpty()
	@IsNumberString()
	@Length(6, 6)
	code: string
}
