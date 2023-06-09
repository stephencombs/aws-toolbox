import fuzzy from 'fuzzy'
import { boldGreen } from './colors.js'

export async function fuzzySearch(input: string, source: string[]) {
	// eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
	return fuzzy.filter(input, source).map((result) => result.original)
}

export function prettifyActions(actions: Readonly<SelectChoices>) {
	return `${boldGreen('Actions')}: ${actions.map((action) => action.name).join(', ')}`
}

export function paddingTopBottom(message: string, paddingAmount = 1) {
	return `${'\n'.repeat(paddingAmount)}${message}${'\n'.repeat(paddingAmount)}`
}
