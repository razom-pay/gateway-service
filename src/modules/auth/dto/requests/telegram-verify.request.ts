import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class TelegramVerifyRequest {
	@ApiProperty({
		example: 'eyJpZCI6NzQxNjYzNDcwLCJmaXJzdF9...'
	})
	@IsString()
	@IsNotEmpty()
	tgAuthResult: string
}
