import { ApiProperty } from '@nestjs/swagger'

export class HealthResponse {
	@ApiProperty({ example: 'ok' })
	status: string
	@ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
	timestamp: string
}
