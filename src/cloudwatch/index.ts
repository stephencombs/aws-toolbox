import select from '@inquirer/select'

export const cloudwatchActions = [] as const

// Entrypoint for this file
export async function cloudwatchActionsPrompt() {
	const choice = (await select({
		message: 'Select an action:',
		choices: cloudwatchActions as unknown as SelectChoices
	})) as GetActions<typeof cloudwatchActions>

	switch (choice) {
	}
}
