import { ConfigService } from '@nestjs/config'

export function getPassportConfig(configService: ConfigService) {
	return {
		secretKey: configService.getOrThrow<string>('PASSPORT_SECRET_KEY')
	}
}
