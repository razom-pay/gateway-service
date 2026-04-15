import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor
} from '@nestjs/common'
import { InjectMetric } from '@willsoto/nestjs-prometheus'
import type { Request, Response } from 'express'
import { Counter, Gauge, Histogram } from 'prom-client'
import { finalize, type Observable } from 'rxjs'

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
	private readonly SERVICE_NAME: string

	constructor(
		@InjectMetric('http_requests_total')
		private readonly counter: Counter<string>,
		@InjectMetric('http_request_duration_seconds')
		private readonly histogram: Histogram<string>,
		@InjectMetric('http_in_progress_requests')
		private readonly inProgress: Gauge<string>
	) {
		this.SERVICE_NAME = 'gateway'
	}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>
	): Observable<any> {
		const req = context.switchToHttp().getRequest<Request>()
		const res = context.switchToHttp().getResponse<Response>()

		const method = req.method

		const route = (req.route as { path?: string })?.path ?? 'unknown'

		this.inProgress.inc({ service: this.SERVICE_NAME })

		const endTimer = this.histogram.startTimer()

		return next.handle().pipe(
			finalize(() => {
				const status = res.statusCode.toString()

				this.counter.inc(
					{ service: this.SERVICE_NAME, method, route, status },
					1
				)

				endTimer({ service: this.SERVICE_NAME, method, route, status })

				this.inProgress.dec({ service: this.SERVICE_NAME })
			})
		)
	}
}
