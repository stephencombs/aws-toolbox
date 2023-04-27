type SelectChoice = {
	value: string
	name?: string
	description?: string
	disabled?: boolean | string
}

type SelectChoices = SelectChoice[]

type GetActions<T extends Readonly<SelectChoices>> = T[number]['value']
