import { CloudWatchLogsClientConfig, DescribeLogGroupsCommand } from '@aws-sdk/client-cloudwatch-logs'
import { getCloudWatchLogsClient } from '../common/clients.js'

export class CloudWatchService {
	constructor(readonly cloudWatchLogsClientConfig: CloudWatchLogsClientConfig = {}) {}

	async describeLogGroups() {
		return await getCloudWatchLogsClient(this.cloudWatchLogsClientConfig).send(new DescribeLogGroupsCommand({}))
	}
}
