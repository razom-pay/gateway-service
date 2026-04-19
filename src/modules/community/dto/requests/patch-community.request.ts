import { ApiPropertyOptional } from '@nestjs/swagger'
import { CommunityVisibility } from '@razom-pay/contracts/gen/community'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class PatchCommunityRequest {
	@ApiPropertyOptional({ example: 'Updated description' })
	@IsOptional()
	@IsString()
	description?: string

	@ApiPropertyOptional({ enum: CommunityVisibility })
	@IsOptional()
	@IsEnum(CommunityVisibility)
	visibility?: CommunityVisibility

	@ApiPropertyOptional({ example: 'UA' })
	@IsOptional()
	@IsString()
	locationCountry?: string

	@ApiPropertyOptional({ example: 'Lviv' })
	@IsOptional()
	@IsString()
	locationCity?: string

	@ApiPropertyOptional({ example: 'Bandery' })
	@IsOptional()
	@IsString()
	locationStreet?: string

	@ApiPropertyOptional({ example: '12' })
	@IsOptional()
	@IsString()
	locationHouse?: string

	@ApiPropertyOptional({
		example: 'https://cdn.razom-pay.ua/community/new-avatar.png'
	})
	@IsOptional()
	@IsString()
	avatar?: string

	@ApiPropertyOptional({
		example: 'https://cdn.razom-pay.ua/community/new-cover.png'
	})
	@IsOptional()
	@IsString()
	cover?: string
}
