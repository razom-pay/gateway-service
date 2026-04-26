import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@razom-pay/passport'
import { LoggerModule } from 'nestjs-pino'

import { AccountModule } from '../modules/account/account.module'
import { AuthModule } from '../modules/auth/auth.module'
import { CommunitiesModule } from '../modules/communities/communities.module'
import { EscrowModule } from '../modules/escrow/escrow.module'
import { UsersModule } from '../modules/users/users.module'
import { ObservabilityModule } from '../observability/observability.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { getPassportConfig } from './config'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				`.env.${process.env.NODE_ENV}.local`,
				`.env.${process.env.NODE_ENV}`,
				'.env'
			]
		}),
		LoggerModule.forRoot({
			pinoHttp: {
				level: process.env.LOG_LEVEL,
				transport: {
					target: 'pino/file',
					options: {
						destination:
							process.platform === 'linux'
								? '/var/log/services/gateway/gateway.log'
								: '.logs/gateway/gateway.log',
						mkdir: true
					}
				},
				messageKey: 'msg',
				customProps: () => ({
					service: 'gateway-service'
				})
			}
		}),
		PassportModule.registerAsync({
			useFactory: getPassportConfig,
			inject: [ConfigService]
		}),
		ObservabilityModule,
		AuthModule,
		AccountModule,
		CommunitiesModule,
		EscrowModule,
		UsersModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
