import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString, Validate } from 'class-validator'
import { IdentifierValidator } from 'src/shared/validators/identifier.validator'

export class SendOtpRequest {
	@ApiProperty({
		example: 'john.doe@example.com'
	})
	@IsString()
	@Validate(IdentifierValidator)
	identifier: string

	@ApiProperty({
		enum: ['phone', 'email'],
		example: 'email'
	})
	@IsEnum(['phone', 'email'])
	type: 'phone' | 'email'
}
