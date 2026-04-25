import request from 'supertest'
import Redis from 'ioredis'
import { createHash } from 'crypto'

/**
 * SYSTEM E2E TESTS
 * 
 * To run these tests, ensure that:
 * 1. Your infrastructure (Postgres, Redis, RabbitMQ) is running (e.g. via docker-compose).
 * 2. Gateway, Auth, and Users microservices are running locally.
 * 3. The Gateway is available at http://localhost:3000.
 */

describe('System E2E (Real HTTP/gRPC flows)', () => {
	const API_URL = process.env.API_URL || 'http://localhost:3000'
	const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
	const TEST_EMAIL = 'e2e-test@example.com'
	const TEST_OTP_CODE = '123456'

	let redis: Redis
	let accessToken: string
	let refreshTokenCookie: string

	beforeAll(() => {
		redis = new Redis(REDIS_URL)
	})

	afterAll(async () => {
		await redis.quit()
	})

	it('1. Send OTP', async () => {
		const res = await request(API_URL).post('/auth/otp/send').send({
			identifier: TEST_EMAIL,
			type: 'email'
		})

		expect(res.status).toBe(200)
		expect(res.body.ok).toBe(true)

		// Overwrite the OTP hash in Redis with our known code '123456'
		const hash = createHash('sha256').update(TEST_OTP_CODE).digest('hex')
		await redis.set(`otp:email:${TEST_EMAIL}`, hash, 'EX', 300)
	})

	it('2. Verify OTP and get tokens', async () => {
		const res = await request(API_URL).post('/auth/otp/Verify').send({
			identifier: TEST_EMAIL,
			type: 'email',
			code: TEST_OTP_CODE
		})

		expect(res.status).toBe(200)
		expect(res.body.accessToken).toBeDefined()
		
		const cookies = res.headers['set-cookie'] as unknown as string[]
		expect(cookies).toBeDefined()
		
		const refreshTokenString = cookies.find((c: string) => c.startsWith('refreshToken='))
		expect(refreshTokenString).toBeDefined()

		accessToken = res.body.accessToken
		refreshTokenCookie = refreshTokenString!.split(';')[0]
	})

	it('3. Refresh tokens', async () => {
		const res = await request(API_URL)
			.post('/auth/refresh')
			.set('Cookie', refreshTokenCookie)
			.send()

		expect(res.status).toBe(200)
		expect(res.body.accessToken).toBeDefined()

		const cookies = res.headers['set-cookie'] as unknown as string[]
		const newRefreshTokenString = cookies.find((c: string) => c.startsWith('refreshToken='))
		
		accessToken = res.body.accessToken
		refreshTokenCookie = newRefreshTokenString!.split(';')[0]
	})

	it('4. Get current user (@me)', async () => {
		const res = await request(API_URL)
			.get('/users/@me')
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(res.status).toBe(200)
		expect(res.body.email).toBe(TEST_EMAIL)
	})

	it('5. Patch user', async () => {
		const newName = `E2E User ${Date.now()}`
		
		const patchRes = await request(API_URL)
			.patch('/users/@me')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({ name: newName })

		expect(patchRes.status).toBe(200)
		expect(patchRes.body.ok).toBe(true)

		const getRes = await request(API_URL)
			.get('/users/@me')
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(getRes.status).toBe(200)
		expect(getRes.body.name).toBe(newName)
	})
})
