import chalk from 'chalk'
import { fuzzySearch } from './utils.js'
import inquirer from 'inquirer'

export function autocomplete(config: { name: string; message: string; source: string[] }) {
	return {
		type: 'autocomplete',
		prefix: chalk.green('✓'),
		name: config.name,
		message: config.message,
		pageSize: 10,
		source: async (_: unknown, input = '') => await fuzzySearch(input, config.source)
	}
}

export function confirm(config: { name: string; message: string }) {
	return inquirer.prompt({
		type: 'confirm',
		prefix: '✅',
		name: config.name,
		message: config.message
	})
}
