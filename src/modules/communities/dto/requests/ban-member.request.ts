import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsISO8601, IsOptional, IsString } from 'class-validator'

export class BanMemberRequest {
	@ApiPropertyOptional({ example: 'Spam' })
	@IsOptional()
	@IsString()
	reason?: string

	@ApiPropertyOptional({ example: '2026-05-19T12:00:00.000Z' })
	@IsOptional()
	@IsISO8601()
	expiresAt?: string
}
