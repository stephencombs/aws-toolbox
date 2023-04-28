import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'
import { LambdaClient, LambdaClientConfig } from '@aws-sdk/client-lambda'
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3'
import { SecretsManagerClient, SecretsManagerClientConfig } from '@aws-sdk/client-secrets-manager'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { CloudWatchLogsClient, CloudWatchLogsClientConfig } from '@aws-sdk/client-cloudwatch-logs'

let dynamoDBDocument: DynamoDBDocument
let lambdaClient: LambdaClient
let s3Client: S3Client
let secretsManagerClient: SecretsManagerClient
let cloudWatchLogsClient: CloudWatchLogsClient

export function getDynamoDBClient(config: DynamoDBClientConfig = {}): DynamoDBDocument {
	if (dynamoDBDocument === null || dynamoDBDocument === undefined) {
		const dynamoDbClient = new DynamoDBClient(config)
		dynamoDBDocument = DynamoDBDocument.from(dynamoDbClient, {
			marshallOptions: { removeUndefinedValues: true }
		})
	}

	return dynamoDBDocument
}

export function getLambdaClient(config: LambdaClientConfig = {}): LambdaClient {
	if (lambdaClient === null || lambdaClient === undefined) {
		lambdaClient = new LambdaClient(config)
	}

	return lambdaClient
}

export function getS3Client(config: S3ClientConfig = {}): S3Client {
	if (s3Client === null || s3Client === undefined) {
		s3Client = new S3Client(config)
	}

	return s3Client
}

export function getSecretsManagerClient(config: SecretsManagerClientConfig = {}): SecretsManagerClient {
	if (secretsManagerClient === null || secretsManagerClient === undefined) {
		secretsManagerClient = new SecretsManagerClient(config)
	}

	return secretsManagerClient
}

export function getCloudWatchLogsClient(config: CloudWatchLogsClientConfig = {}): CloudWatchLogsClient {
	if (cloudWatchLogsClient === null || cloudWatchLogsClient === undefined) {
		cloudWatchLogsClient = new CloudWatchLogsClient(config)
	}

	return cloudWatchLogsClient
}
