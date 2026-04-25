import { ApiProperty } from '@nestjs/swagger'

import { InitiativeResponse } from './initiative.response'

export class InitiativeListResponse {
	@ApiProperty({ type: [InitiativeResponse] })
	initiatives!: InitiativeResponse[]
}
