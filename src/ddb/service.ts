import { ListTablesCommand, DescribeTableCommand, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { exit } from 'process';
import chalk from 'chalk';
import ora, { oraPromise } from 'ora';
import { getDynamoDBClient } from '../common/clients.js';

export class DynamoService {
    constructor(readonly ddbClientConfig: DynamoDBClientConfig = {}) {}

    async getTables() {
        const result = await getDynamoDBClient(this.ddbClientConfig).send(new ListTablesCommand({}));
        return result.TableNames ?? [];
    }

    async listTables() {
        const spinner = ora('Scanning account for tables').start();
        const result = await this.getTables();

        if (!result) {
            spinner.fail('No tables found on account');
            exit(0);
        }

        spinner.succeed(`Found ${result.length} tables`);
        console.log(result);
    }

    async clear(source: string): Promise<void> {
        let data: Record<string, any>[] | undefined = [];

        const result = await oraPromise(
            getDynamoDBClient(this.ddbClientConfig).scan({
                TableName: source.trim()
            }),
            {
                text: `Scanning ${chalk.blue.bold(source)}`,
                successText: `Data from ${chalk.blue.bold(source)} scanned`,
                failText: `Failed during scan of ${chalk.blue.bold(source)}`
            }
        );

        data = result.Items;

        if (!data) {
            console.error('No data found in source table, safely exiting...');
            exit(0);
        }

        const detailsResponse = await oraPromise(
            getDynamoDBClient(this.ddbClientConfig).send(new DescribeTableCommand({ TableName: source.trim() })),
            {
                text: `Retrieving details for ${chalk.blue.bold(source)}`,
                successText: `Details retrieved for ${chalk.blue.bold(source)}`,
                failText: `Failed during detail retrival for ${chalk.blue.bold(source)}`
            }
        );

        if (!detailsResponse.Table) {
            console.error(`No details found for ${chalk.blue.bold(source)}, safely exiting...`);
            exit(0);
        }

        const pkName = detailsResponse.Table.KeySchema!.find((item) => item.KeyType === 'HASH')?.AttributeName!;

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
                text: `Deleting all items in ${chalk.blue.bold(source)}`,
                successText: `Deletion completed for ${chalk.blue.bold(source)}`,
                failText: `Failed during deletion on ${chalk.blue.bold(source)}`
            }
        );
    }

    async copy(source: string, dest: string) {
        let data: Record<string, any>[] | undefined = [];

        const result = await oraPromise(
            getDynamoDBClient(this.ddbClientConfig).scan({
                TableName: source.trim()
            }),
            {
                text: `Scanning ${chalk.blue.bold(source)}`,
                successText: `Data from ${chalk.blue.bold(source)} scanned`,
                failText: `Failed during scan of ${chalk.blue.bold(source)}`
            }
        );

        data = result.Items;

        if (!data) {
            console.error('No data found in source table, safely exiting...');
            exit(0);
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
                text: `Copying data to ${chalk.yellow.bold(dest)}`,
                successText: `Copy from ${chalk.blue.bold(source)} to ${chalk.yellow.bold(dest)} complete!`,
                failText: `Failed to copy from ${chalk.blue.bold(source)} to ${chalk.yellow.bold(dest)}`
            }
        );
    }
}
