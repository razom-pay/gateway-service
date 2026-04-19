import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CommunityVisibility } from '@razom-pay/contracts/gen/community'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCommunityRequest {
	@ApiProperty({ example: 'Kyiv Fintech Builders' })
	@IsString()
	@IsNotEmpty()
	description!: string

	@ApiProperty({
		enum: CommunityVisibility,
		example: CommunityVisibility.COMMUNITY_VISIBILITY_PUBLIC
	})
	@IsEnum(CommunityVisibility)
	visibility!: CommunityVisibility

	@ApiPropertyOptional({ example: 'UA' })
	@IsOptional()
	@IsString()
	locationCountry?: string

	@ApiPropertyOptional({ example: 'Kyiv' })
	@IsOptional()
	@IsString()
	locationCity?: string

	@ApiPropertyOptional({ example: 'Khreshchatyk' })
	@IsOptional()
	@IsString()
	locationStreet?: string

	@ApiPropertyOptional({ example: '1A' })
	@IsOptional()
	@IsString()
	locationHouse?: string

	@ApiPropertyOptional({
		example: 'https://cdn.razom-pay.ua/community/avatar.png'
	})
	@IsOptional()
	@IsString()
	avatar?: string

	@ApiPropertyOptional({
		example: 'https://cdn.razom-pay.ua/community/cover.png'
	})
	@IsOptional()
	@IsString()
	cover?: string
}
