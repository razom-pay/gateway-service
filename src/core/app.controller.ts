import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { AppService } from './app.service'
import { HealthResponse } from './dto'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@ApiOperation({
		summary: 'Welcome endpoint',
		description: 'Returns a simple greeting message.'
	})
	@Get()
	getHello() {
		return this.appService.getHello()
	}

	@ApiOperation({
		summary: 'Health check',
		description: 'Check if the Gateway is running.'
	})
	@ApiOkResponse({
		type: HealthResponse
	})
	@Get('health')
	health() {
		return this.appService.health()
	}
}
