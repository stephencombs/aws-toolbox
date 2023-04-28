import inquirer from 'inquirer'
import { autocomplete } from '../common/prompts.js'
import { SecretsService } from './service.js'

const secretsService = new SecretsService()

export async function listPrompt() {
	console.log(await secretsService.getSecrets())
}

export async function describePrompt() {
	const source = await secretsService.getSecrets()
	const { name } = await inquirer.prompt([autocomplete({ name: 'name', message: `Select a secret:`, source })])
	console.log(await secretsService.describe(name))
}
