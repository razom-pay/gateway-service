import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GetMeResponse {
	@ApiProperty({
		example: 'iZQZ7gPxeSKxA4IyP_0nl'
	})
	id!: string

	@ApiPropertyOptional({
		example: 'Kyrylo Lytvishko'
	})
	name?: string

	@ApiProperty({
		example: 'kyrylo.lytvishko@razom-pay.ua'
	})
	email!: string

	@ApiProperty({
		example: '+380631234567'
	})
	phone!: string

	@ApiPropertyOptional({
		example: 'https://razom-pay.ua/users/avatar.jpg'
	})
	avatarUrl?: string
}
