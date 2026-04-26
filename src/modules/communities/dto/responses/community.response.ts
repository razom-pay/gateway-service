import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

// TODO: use LocationResponse in CommunityResponse and refactor
export class LocationResponse {
	@ApiPropertyOptional({ example: 'UA' })
	country?: string

	@ApiPropertyOptional({ example: 'Kyiv' })
	city?: string

	@ApiPropertyOptional({ example: 'Khreshchatyk' })
	street?: string

	@ApiPropertyOptional({ example: '12' })
	house?: string
}
export class CommunityResponse {
	@ApiProperty({ example: 'A7h9Z5wQpLy0_2mT' })
	id!: string

	@ApiProperty({ example: 'Community description' })
	description!: string

	@ApiProperty({ example: 1 })
	visibility!: number

	@ApiPropertyOptional({ example: 'UA' })
	locationCountry?: string

	@ApiPropertyOptional({ example: 'Kyiv' })
	locationCity?: string

	@ApiPropertyOptional({ example: 'Khreshchatyk' })
	locationStreet?: string

	@ApiPropertyOptional({ example: '12' })
	locationHouse?: string

	@ApiPropertyOptional({
		example: 'https://cdn.razom-pay.ua/communities/avatar.png'
	})
	avatar?: string

	@ApiPropertyOptional({
		example: 'https://cdn.razom-pay.ua/communities/cover.png'
	})
	cover?: string

	@ApiProperty({ example: 15 })
	membersCount!: number

	@ApiProperty({ example: 'iZQZ7gPxeSKxA4IyP_0nl' })
	createdByUserId!: string

	@ApiProperty({ example: '2026-04-19T12:00:00.000Z' })
	createdAt!: string

	@ApiProperty({ example: '2026-04-19T12:00:00.000Z' })
	updatedAt!: string
}
