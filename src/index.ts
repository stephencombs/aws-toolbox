#!/usr/bin/env node

import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts'
import select from '@inquirer/select'
import chalk from 'chalk'
import { oraPromise } from 'ora'
import { exit } from 'process'
import { awsOrange, boldGreen } from './common/colors.js'
import { confirm } from './common/prompts.js'
import { ddbActionsPrompt, dynamoDbActions } from './ddb/index.js'
import { s3Actions, s3ActionsPrompt } from './s3/index.js'
import { secretsActionPrompt, secretsActions } from './secrets/index.js'

// Will error if the user has invalid/expired credentials
try {
	const stsClient = new STSClient({})
	await oraPromise(stsClient.send(new GetCallerIdentityCommand({})), {
		text: 'Checking for valid credentials'
	})
	console.clear()
} catch (e: unknown) {
	if (e instanceof Error)
		if (e.name === 'CredentialsProviderError')
			console.log(
				chalk.red(
					`Your credientials are invalid or expired, please login using ${chalk.white.bold(
						'`aws sso login`'
					)}`
				)
			)
	exit(1)
}

const toolboxChoices = [
	{
		name: 'DynamoDB',
		value: 'ddb',
		description: `${boldGreen('Actions')}: ${dynamoDbActions.map((action) => action.name).join(', ')}`
	},
	{
		name: 'S3',
		value: 's3',
		description: `${boldGreen('Actions')}: ${s3Actions.map((action) => action.name).join(', ')}`
	},
	// {
	// 	name: 'Cloudwatch',
	// 	value: 'cwatch',
	// 	description: `${boldGreen('Actions')}: ${cloudwatchActions.map((action) => action.name).join(', ')}`
	// },
	// {
	// 	name: 'Lambda',
	// 	value: 'lambda',
	// 	description: `${boldGreen('Actions')}: ${lambdaActions.map((action) => action.name).join(', ')}`
	// },
	{
		name: 'SecretsManager',
		value: 'secrets',
		description: `${boldGreen('Actions')}: ${secretsActions.map((action) => action.name).join(', ')}`
	}
] as const

// Welcome Message
console.log(' -------------------------------')
console.log(chalk.bold(`  Welcome to the ${awsOrange('AWS Toolbox')} 🧰`))
console.log(' -------------------------------')

async function init() {
	const tool = (await select({
		message: 'Select a service:',
		choices: toolboxChoices as unknown as SelectChoices
	})) as GetActions<typeof toolboxChoices>

	switch (tool) {
		case 'ddb':
			await ddbActionsPrompt()
			break
		case 's3':
			await s3ActionsPrompt()
			break
		// case 'cwatch':
		// 	await cloudwatchActionsPrompt()
		// 	break
		// case 'lambda':
		// 	await lambdaActionsPrompt()
		// 	break
		case 'secrets':
			await secretsActionPrompt()
			break
	}

	// Check if user would like to perform another action
	const { another } = await confirm({
		name: 'another',
		message: 'Would you like to perform another action?'
	})
	if (another) {
		console.clear()
		await init()
	}
}

// Startup Call
await init()
