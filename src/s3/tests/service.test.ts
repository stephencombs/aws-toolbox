import process from 'node:process'
import {
	CreateBucketCommand,
	DeleteBucketCommand,
	DeleteObjectsCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3'
import { jest } from '@jest/globals'
import { S3Service } from '../service.js'

jest.mock('@aws-sdk/client-s3')

describe('S3Service', () => {
	const localstackEndpoint = 'https://s3.localhost.localstack.cloud:4566'
	const s3Service = new S3Service({
		endpoint: localstackEndpoint,
		region: 'us-east-2'
	})
	const s3Client = new S3Client({
		endpoint: localstackEndpoint,
		region: 'us-east-2'
	})
	const testBucket1 = 'test'
	const testBucket2 = 'test2'

	beforeAll(async () => {
		process.env.AWS_ACCESS_KEY_ID = 'testAccessKeyId'
		process.env.AWS_SECRET_ACCESS_KEY = 'testSecretAccessKey'
		// Test Bucket 1
		await s3Client.send(new CreateBucketCommand({ Bucket: testBucket1 }))
		await s3Client.send(new PutObjectCommand({ Bucket: testBucket1, Key: 'testObj1', Body: 'test body' }))
		await s3Client.send(new PutObjectCommand({ Bucket: testBucket1, Key: 'testObj2' }))
		await s3Client.send(new PutObjectCommand({ Bucket: testBucket1, Key: 'testObj3' }))
		await s3Client.send(new PutObjectCommand({ Bucket: testBucket1, Key: 'testObj4' }))

		// Test Bucket 2
		await s3Client.send(new CreateBucketCommand({ Bucket: testBucket2 }))
	})

	afterAll(async () => {
		await s3Client.send(
			new DeleteObjectsCommand({
				Bucket: testBucket1,
				Delete: {
					Objects: [{ Key: 'testObj1' }, { Key: 'testObj2' }, { Key: 'testObj3' }, { Key: 'testObj4' }]
				}
			})
		)
		await s3Client.send(new DeleteBucketCommand({ Bucket: testBucket1 }))
		await s3Client.send(new DeleteBucketCommand({ Bucket: testBucket2 }))
	})

	it('lists S3 buckets on the account', async () => {
		const buckets = await s3Service.getBuckets()
		expect(buckets).toHaveLength(2)
	})

	it('lists objects in a Bucket', async () => {
		const objects = await s3Service.getBucketObjects(testBucket1)
		expect(objects).toHaveLength(4)
	})

	it('downloads an object', async () => {
		let object = await s3Service.download(testBucket1, 'testObj1')
		expect(object).toStrictEqual('test body')

		object = await s3Service.download(testBucket1, 'testObj2')
		expect(object).toStrictEqual('')
	})

	it('copies objects from one Bucket to another', async () => {
		await s3Service.copy(testBucket1, testBucket2)
		const objects = await s3Service.getBucketObjects(testBucket2)
		expect(objects).toHaveLength(4)
	})

	// This test MUST come last to empty testBucket2 for the teardown process
	it('clears a Bucket', async () => {
		await s3Service.clear(testBucket2)
		const objects = await s3Service.getBucketObjects(testBucket2)
		expect(objects).toHaveLength(0)
	})
})
