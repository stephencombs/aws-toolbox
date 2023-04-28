import inquirer from 'inquirer'
import { fuzzySearch } from '../common/utils.js'
import { LambdaService } from './service.js'

const lambdaService = new LambdaService()

async function invokePrompt() {
	const { name } = await inquirer.prompt([await createFunctionPrompt('name', `Select a function:`)])
	console.log(await lambdaService.invoke(name))
}

export { invokePrompt }

async function createFunctionPrompt(name: string, message: string) {
	const functionSource = await lambdaService.getFunctions()
	console.log(functionSource.length)
	return {
		type: 'autocomplete',
		name: name,
		message: message,
		suggestOnly: true,
		pageSize: 10,
		source: (_: unknown, input = '') => fuzzySearch(input, functionSource)
	}
}
