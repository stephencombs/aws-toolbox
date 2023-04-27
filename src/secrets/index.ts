import select from '@inquirer/select'
import { describePrompt, listPrompt } from './action.js'

export const secretsActions = [
	{
		name: 'Describe',
		value: 'describe',
		description: 'Get the details of a secret'
	},
	{
		name: 'List Secrets',
		value: 'list',
		description: 'Just a quick log of all secrets on your account'
	}
] as const

// Entrypoint for this file
export async function secretsActionPrompt() {
	const choice = (await select({
		message: 'Select an action:',
		choices: secretsActions as unknown as SelectChoices
	})) as GetActions<typeof secretsActions>

	switch (choice) {
		case 'describe':
			await describePrompt()
			break
		case 'list':
			await listPrompt()
			break
	}
}
