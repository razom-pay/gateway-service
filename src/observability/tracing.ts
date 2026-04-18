import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'

const traceExporter = new OTLPTraceExporter({
	// TODO: Check working with 4317 istead of 4318/v1/traces
	// Use 4318/v1/traces for Jaeger and OTEL Collector, 4317 is for OTEL Collector gRPC
	url: 'http://jaeger:4318/v1/traces'
})

export const otelSdk = new NodeSDK({
	traceExporter,
	resource: resourceFromAttributes({
		[ATTR_SERVICE_NAME]: 'gateway-service'
	}),
	instrumentations: [
		getNodeAutoInstrumentations({
			'@opentelemetry/instrumentation-http': { enabled: true },
			'@opentelemetry/instrumentation-express': { enabled: true },
			'@opentelemetry/instrumentation-nestjs-core': {
				enabled: true
			},
			'@opentelemetry/instrumentation-grpc': { enabled: true }
		})
	]
})

otelSdk.start()
