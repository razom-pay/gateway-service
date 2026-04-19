import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsISO8601, IsOptional, IsString } from 'class-validator'

export class InviteMemberRequest {
	@ApiProperty({ example: 'iZQZ7gPxeSKxA4IyP_0nl' })
	@IsString()
	invitedUserId!: string

	@ApiPropertyOptional({ example: '2026-05-19T12:00:00.000Z' })
	@IsOptional()
	@IsISO8601()
	expiresAt?: string
}
