import { ApiProperty } from '@nestjs/swagger'
import { CommunityRole } from '@razom-pay/contracts/gen/community'
import { IsEnum } from 'class-validator'

export class AssignRoleRequest {
	@ApiProperty({
		enum: CommunityRole,
		example: CommunityRole.COMMUNITY_ROLE_MODERATOR
	})
	@IsEnum(CommunityRole)
	role!: CommunityRole
}
