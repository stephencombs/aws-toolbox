import select from '@inquirer/select'
import { invokePrompt } from './action.js'

export const lambdaActions = [
	{
		name: 'Invoke',
		value: 'invoke'
	}
] as const

// Entrypoint for this file
export async function lambdaActionsPrompt() {
	const choice = (await select({
		message: 'Select an action:',
		choices: lambdaActions as unknown as SelectChoices
	})) as GetActions<typeof lambdaActions>

	switch (choice) {
		case 'invoke':
			await invokePrompt()
			break
	}
}
