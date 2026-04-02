import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class InitEmailChangeRequest {
	@ApiProperty({
		example: 'email@example.com'
	})
	@IsNotEmpty()
	@IsEmail()
	email: string
}
