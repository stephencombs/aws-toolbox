import process from 'node:process'
import {
	CreateTableCommand,
	DeleteTableCommand,
	DynamoDBClient,
	PutItemCommand,
	ScanCommand
} from '@aws-sdk/client-dynamodb'
import { DynamoService } from '../service.js'

describe('DynamoDBService', () => {
	const localstackEndpoint = 'https://dynamo.localhost.localstack.cloud:4566'
	const dynamoDbService = new DynamoService({
		endpoint: localstackEndpoint,
		region: 'us-east-2'
	})
	const ddbClient = new DynamoDBClient({
		endpoint: localstackEndpoint,
		region: 'us-east-2'
	})
	const testTable1 = 'test'
	const testTable2 = 'test2'
	const tableConfig = {
		AttributeDefinitions: [
			{
				AttributeName: 'TestKey',
				AttributeType: 'S'
			}
		],
		KeySchema: [
			{
				AttributeName: 'TestKey',
				KeyType: 'HASH'
			}
		],
		BillingMode: 'PAY_PER_REQUEST'
	}

	beforeAll(async () => {
		process.env.AWS_ACCESS_KEY_ID = 'testAccessKeyId'
		process.env.AWS_SECRET_ACCESS_KEY = 'testSecretAccessKey'
		// Test Table 1
		await ddbClient.send(
			new CreateTableCommand({
				TableName: testTable1,
				...tableConfig
			})
		)
		await ddbClient.send(
			new PutItemCommand({
				TableName: testTable1,
				Item: {
					TestKey: {
						S: 'Test Name 1'
					}
				}
			})
		)
		await ddbClient.send(
			new PutItemCommand({
				TableName: testTable1,
				Item: {
					TestKey: {
						S: 'Test Name 2'
					}
				}
			})
		)

		// Test Table 2
		await ddbClient.send(
			new CreateTableCommand({
				TableName: testTable2,
				...tableConfig
			})
		)
	})

	afterAll(async () => {
		await ddbClient.send(new DeleteTableCommand({ TableName: testTable1 }))
		await ddbClient.send(new DeleteTableCommand({ TableName: testTable2 }))
	})

	it('lists Dynamo tables on the account', async () => {
		const tables = await dynamoDbService.getTables()
		expect(tables).toHaveLength(2)
	})

	it('copies items from one Table to another', async () => {
		await dynamoDbService.copy(testTable1, testTable2)
		const items = await ddbClient.send(
			new ScanCommand({
				TableName: testTable2
			})
		)
		expect(items.Items).toHaveLength(2)
	})

	it('clears a Table', async () => {
		await dynamoDbService.clear(testTable2)
		const items = await ddbClient.send(
			new ScanCommand({
				TableName: testTable2
			})
		)
		expect(items.Items).toHaveLength(0)
	})
})
