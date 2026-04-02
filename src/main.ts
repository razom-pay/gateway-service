import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'

import { AppModule } from './core/app.module'
import { getCorsConfig, getValidationPipeConfig } from './core/config'
import { GrpcExceptionFilter } from './shared/filters'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const configService = app.get(ConfigService)
	const logger = new Logger()

	app.use(cookieParser(configService.getOrThrow<string>('COOKIES_SECRET')))

	app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()))

	app.useGlobalFilters(new GrpcExceptionFilter())

	app.enableCors(getCorsConfig(configService))

	const swaggerConfig = new DocumentBuilder()
		.setTitle('Razom Pay API')
		.setDescription('API Gateway for Razom Pay')
		.setVersion('1.0')
		.addBearerAuth()
		.build()

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('/docs', app, swaggerDocument, {
		yamlDocumentUrl: '/openapi.yaml'
	})

	const port = configService.getOrThrow<number>('HTTP_PORT')
	const host = configService.getOrThrow<string>('HTTP_HOST')

	await app.listen(port)

	logger.log(`Gateway started at ${host}`)
	logger.log(`Swagger; ${host}/docs`)
}
bootstrap()
