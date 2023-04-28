import inquirer from 'inquirer'
import { boldBlue, boldRed, boldYellow } from '../common/colors.js'
import { fuzzySearch } from '../common/utils.js'
import { DynamoService } from './service.js'
import { autocomplete } from '../common/prompts.js'

const ddbService = new DynamoService()
const tableSource = await ddbService.getTables()

// Action Prompts
export async function clearPrompt() {
	const { name } = await inquirer.prompt([
		autocomplete({ name: 'name', message: `Select a table to clear:`, source: tableSource })
	])
	const { confirmed } = await inquirer.prompt({
		type: 'confirm',
		name: 'confirmed',
		message: `${boldRed(
			`You are about to delete all items from ${boldBlue(name)}, are you sure you want to do this?`
		)}`
	})
	if (confirmed) await ddbService.clear(name)
	return
}

export async function copyPrompt() {
	const { source, dest } = await inquirer.prompt([
		autocomplete({ name: 'source', message: `Select the ${boldBlue('source')} table:`, source: tableSource }),
		autocomplete({
			name: 'dest',
			message: `Select the ${boldYellow('destination')} table:`,
			source: tableSource
		})
	])

	await ddbService.copy(source, dest)
}

export async function listPrompt() {
	await ddbService.listTables()
}
