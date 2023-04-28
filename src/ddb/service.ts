import { DescribeTableCommand, DynamoDBClientConfig, ListTablesCommand } from '@aws-sdk/client-dynamodb'
import ora, { oraPromise } from 'ora'
import { getDynamoDBClient } from '../common/clients.js'
import { boldBlue, boldRed, boldYellow } from '../common/colors.js'

export class DynamoService {
	constructor(readonly ddbClientConfig: DynamoDBClientConfig = {}) {}

	async getTables() {
		const result = await getDynamoDBClient(this.ddbClientConfig).send(new ListTablesCommand({}))
		return result.TableNames ?? []
	}

	async listTables() {
		const spinner = ora('Scanning account for tables').start()
		const result = await this.getTables()

		if (!result) {
			spinner.fail('No tables found on account')
			return
		}

		spinner.succeed(`Found ${result.length} tables`)
		console.log(result)
	}

	async clear(source: string): Promise<void> {
		let data: Record<string, unknown>[] | undefined = []

		const result = await oraPromise(
			getDynamoDBClient(this.ddbClientConfig).scan({
				TableName: source.trim()
			}),
			{
				text: `Scanning ${boldBlue(source)}`,
				successText: `Data from ${boldBlue(source)} scanned`,
				failText: `Failed during scan of ${boldBlue(source)}`
			}
		)

		data = result.Items

		if (!data) {
			console.error(boldRed(`No data found in ${source}`))
			return
		}

		const detailsResponse = await oraPromise(
			getDynamoDBClient(this.ddbClientConfig).send(new DescribeTableCommand({ TableName: source.trim() })),
			{
				text: `Retrieving details for ${boldBlue(source)}`,
				successText: `Details retrieved for ${boldBlue(source)}`,
				failText: `Failed during detail retrival for ${boldBlue(source)}`
			}
		)

		if (!detailsResponse.Table) {
			console.error(`No details found for ${boldBlue(source)}`)
			return
		}

		const pkName = detailsResponse.Table.KeySchema?.find((item) => item.KeyType === 'HASH')?.AttributeName

		if (!pkName) {
			console.error(boldRed(`Could not find a Primary Key for ${source}`))
			return
		}

		await oraPromise(
			Promise.all(
				data.map((item) =>
					getDynamoDBClient(this.ddbClientConfig).delete({
						TableName: source.trim(),
						Key: {
							[pkName]: item[pkName]
						}
					})
				)
			),
			{
				text: `Deleting all items in ${boldBlue(source)}`,
				successText: `Deletion completed for ${boldBlue(source)}`,
				failText: `Failed during deletion on ${boldBlue(source)}`
			}
		)
	}

	async copy(source: string, dest: string) {
		let data: Record<string, unknown>[] | undefined = []

		const result = await oraPromise(
			getDynamoDBClient(this.ddbClientConfig).scan({
				TableName: source.trim()
			}),
			{
				text: `Scanning ${boldBlue(source)}`,
				successText: `Data from ${boldBlue(source)} scanned`,
				failText: `Failed during scan of ${boldBlue(source)}`
			}
		)

		data = result.Items

		if (!data) {
			console.error(boldRed(`No data found in ${source}`))
			return
		}

		await oraPromise(
			Promise.all(
				data.map((item) =>
					getDynamoDBClient(this.ddbClientConfig).put({
						TableName: dest.trim(),
						Item: item,
						ReturnValues: 'ALL_OLD'
					})
				)
			),
			{
				text: `Copying data to ${boldYellow(dest)}`,
				successText: `Copy from ${boldBlue(source)} to ${boldYellow(dest)} complete!`,
				failText: `Failed to copy from ${boldBlue(source)} to ${boldYellow(dest)}`
			}
		)
	}
}
