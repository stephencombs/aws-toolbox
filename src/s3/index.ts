import select from '@inquirer/select'
import { clearPrompt, copyPrompt, downloadPrompt, listObjectsPrompt } from './action.js'

export const s3Actions = [
	{
		name: 'Copy',
		value: 'copy',
		description: 'Copy items from one Bucket to another'
	},
	{
		name: 'Clear',
		value: 'clear',
		description: 'Need a quick reset? Use this to empty a Bucket'
	},
	// {
	// 	name: 'Upload',
	// 	value: 'upload',
	// 	description: 'Upload a file from your local system to a Bucket'
	// },
	// new inquirer.Separator(),
	{
		name: 'List Objects',
		value: 'listObjs',
		description: 'Logs a list of up to 1000 objects in Bucket'
	},
	{
		name: 'Download',
		value: 'download',
		description: 'Download an object from a Bucket'
	}
] as const

// Entrypoint for this file
export async function s3ActionsPrompt() {
	const choice = (await select({
		message: 'Select an action:',
		choices: s3Actions as unknown as SelectChoices
	})) as GetActions<typeof s3Actions>

	switch (choice) {
		case 'copy':
			await copyPrompt()
			break
		case 'clear':
			await clearPrompt()
			break
		case 'listObjs':
			await listObjectsPrompt()
			break
		case 'download':
			await downloadPrompt()
			break
	}
}
