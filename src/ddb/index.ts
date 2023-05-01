import { exit } from 'node:process'
import select from '@inquirer/select'
import { clearPrompt, copyPrompt, listPrompt } from './action.js'

export const dynamoDbActions = [
	{
		name: 'Copy',
		value: 'copy',
		description: 'Copy items from one Dynamo table to another'
	},
	{
		name: 'Clear',
		value: 'clear',
		description: 'Need a quick reset? Use this to empty a Dynamo table'
	},
	{
		name: 'List Tables',
		value: 'list',
		description: 'Just a quick log of all tables on your account'
	}
] as const

// Entrypoint for this file
export async function ddbActionsPrompt() {
	const choice = (await select({
		message: 'Select an action:',
		choices: dynamoDbActions as unknown as SelectChoices
	})) as GetActions<typeof dynamoDbActions>

	switch (choice) {
		case 'copy': {
			await copyPrompt()
			break
		}

		case 'clear': {
			await clearPrompt()
			break
		}

		case 'list': {
			await listPrompt()
			break
		}

		default: {
			exit(1)
		}
	}
}
