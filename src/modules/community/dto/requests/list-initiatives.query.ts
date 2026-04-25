import { Type } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import {
	InitiativeStatus,
	InitiativeType
} from '@razom-pay/contracts/gen/community'

export class ListInitiativesQuery {
	@ApiPropertyOptional({
		enum: InitiativeType,
		example: InitiativeType.INITIATIVE_TYPE_CROWDFUNDING
	})
	@IsOptional()
	@Type(() => Number)
	@IsEnum(InitiativeType)
	type?: InitiativeType

	@ApiPropertyOptional({
		enum: InitiativeStatus,
		example: InitiativeStatus.INITIATIVE_STATUS_ACTIVE
	})
	@IsOptional()
	@Type(() => Number)
	@IsEnum(InitiativeStatus)
	status?: InitiativeStatus
}
