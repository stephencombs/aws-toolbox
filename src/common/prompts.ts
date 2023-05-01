import chalk from 'chalk'
import inquirer from 'inquirer'
import { fuzzySearch } from './utils.js'

export function autocomplete(config: { name: string; message: string; source: string[] }) {
	return {
		type: 'autocomplete',
		prefix: chalk.green('✓'),
		name: config.name,
		message: config.message,
		pageSize: 10,
		source: async (_: unknown, input = '') => fuzzySearch(input, config.source)
	}
}

export async function confirm(config: { name: string; message: string }) {
	return inquirer.prompt({
		type: 'confirm',
		prefix: '✅',
		name: config.name,
		message: config.message
	})
}

export function fuzzypath(config: {
	name: string
	message: string
	type: 'any' | 'directory' | 'file'
	suggestOnly: boolean
	depth: number
}) {
	return {
		type: 'fuzzypath',
		name: config.name,
		itemType: config.type,
		rootPath: '/',
		message: config.message,
		suggestOnly: config.suggestOnly,
		depthLimit: config.depth
	}
}
