import { ApiProperty } from '@nestjs/swagger'
import {
	IsEnum,
	IsNotEmpty,
	IsNumberString,
	IsString,
	Length,
	Validate
} from 'class-validator'

import { IdentifierValidator } from '../../../../shared/validators'

export class VerifyOtpRequest {
	@ApiProperty({
		example: 'john.doe@example.com'
	})
	@IsString()
	@Validate(IdentifierValidator)
	identifier!: string

	@ApiProperty({
		example: '123456'
	})
	@IsNotEmpty()
	@IsNumberString()
	@Length(6, 6)
	code!: string

	@ApiProperty({
		enum: ['phone', 'email'],
		example: 'email'
	})
	@IsEnum(['phone', 'email'])
	type!: 'phone' | 'email'
}
