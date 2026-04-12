import { OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom, type Observable } from 'rxjs'

type UnwrapObservable<T> = T extends Observable<infer R> ? R : T

export abstract class AbstractGrpcClient<
	T extends Record<string, any>
> implements OnModuleInit {
	protected service!: T

	protected constructor(
		private readonly client: ClientGrpc,
		private readonly serviceName: string
	) {}

	onModuleInit() {
		this.service = this.client.getService<T>(this.serviceName)
	}

	async call<K extends keyof T>(
		method: K,
		payload: Parameters<T[K]>[0]
	): Promise<UnwrapObservable<ReturnType<T[K]>>> {
		try {
			// TODO: review letter
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
			const observable = this.service[method](payload)
			const result = await lastValueFrom(observable)

			return result as UnwrapObservable<ReturnType<T[K]>>
		} catch (error) {
			console.error(`Error calling gRPC method ${String(method)}:`, error)
			throw error
		}
	}
}
