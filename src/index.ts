#!/usr/bin/env node

import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts'
import select from '@inquirer/select'
import chalk from 'chalk'
import inquirer from 'inquirer'
import autocompletePrompt from 'inquirer-autocomplete-prompt'
import fuzzypathPrompt from 'inquirer-fuzzy-path'
import { oraPromise } from 'ora'
import { exit } from 'process'
import { awsOrange, boldWhite } from './common/colors.js'
import { confirm } from './common/prompts.js'
import { prettifyActions } from './common/utils.js'
import { ddbActionsPrompt, dynamoDbActions } from './ddb/index.js'
import { s3Actions, s3ActionsPrompt } from './s3/index.js'
import { secretsActionPrompt, secretsActions } from './secrets/index.js'

inquirer.registerPrompt('autocomplete', autocompletePrompt)
inquirer.registerPrompt('fuzzypath', fuzzypathPrompt)

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
					`Your credientials are invalid or expired, please login using ${boldWhite('`aws sso login`')}`
				)
			)
	exit(1)
}

const toolboxChoices = [
	{
		name: 'DynamoDB',
		value: 'ddb',
		description: prettifyActions(dynamoDbActions)
	},
	{
		name: 'S3',
		value: 's3',
		description: prettifyActions(s3Actions)
	},
	{
		name: 'SecretsManager',
		value: 'secrets',
		description: prettifyActions(secretsActions)
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
