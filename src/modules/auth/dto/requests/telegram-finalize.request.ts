import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class TelegramFinalizeRequest {
	@ApiProperty({
		example: '1a3d8494b3c951dc24b8cccbdf909cfd'
	})
	@IsString()
	@IsNotEmpty()
	sessionId!: string
}
