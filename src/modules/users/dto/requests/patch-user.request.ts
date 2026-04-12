import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class PatchUserRequest {
	@ApiProperty({
		example: 'Kyrylo Lytvishko'
	})
	@IsString()
	@IsNotEmpty()
	name!: string
}
