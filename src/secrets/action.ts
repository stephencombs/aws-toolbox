import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import { fuzzySearch } from '../common/utils.js';
import { SecretsService } from './service.js';
import chalk from 'chalk';
import { autocomplete } from '../common/prompts.js';

// Register Autocomplete Prompt Type
inquirer.registerPrompt('autocomplete', inquirerPrompt);

const secretsService = new SecretsService();

export async function listPrompt() {
    console.log(await secretsService.getSecrets());
}

export async function describePrompt() {
    const source = await secretsService.getSecrets();
    const { name } = await inquirer.prompt([autocomplete({ name: 'name', message: `Select a secret:`, source })]);
    console.log(await secretsService.describe(name));
}
