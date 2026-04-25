import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { InitiativeContributionRuleType } from '@razom-pay/contracts/gen/community'
import { IsEnum, IsOptional, Matches } from 'class-validator'

export class CreateCrowdfundingConfigRequest {
	@ApiProperty({
		enum: InitiativeContributionRuleType,
		example:
			InitiativeContributionRuleType.INITIATIVE_CONTRIBUTION_RULE_TYPE_ANY
	})
	@IsEnum(InitiativeContributionRuleType)
	ruleType!: InitiativeContributionRuleType

	@ApiPropertyOptional({ example: '10000' })
	@IsOptional()
	@Matches(/^[0-9]+$/)
	minAmountMinor?: string

	@ApiPropertyOptional({ example: '50000' })
	@IsOptional()
	@Matches(/^[0-9]+$/)
	fixedAmountMinor?: string

	@ApiPropertyOptional({ example: '100000' })
	@IsOptional()
	@Matches(/^[0-9]+$/)
	maxAmountMinor?: string
}
