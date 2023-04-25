import chalk from 'chalk';
import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import { DynamoService } from './service.js';
import { fuzzySearch } from '../common/utils.js';

// Register Autocomplete Prompt Type
inquirer.registerPrompt('autocomplete', inquirerPrompt);

const ddbService = new DynamoService();

// Action Prompts
async function clearPrompt() {
    const { name } = await inquirer.prompt([await createTablePrompt('name', `Select a table to clear:`)]);
    const { confirmed } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirmed',
        message: `${chalk.red.bold(
            `You are about to delete all items from ${chalk.blue.bold(name)}, are you sure you want to do this?`
        )}`
    });
    if (confirmed) await ddbService.clear(name);
    return;
}

async function copyPrompt() {
    const { source, dest } = await inquirer.prompt(
        await Promise.all([
            createTablePrompt('source', `Select the ${chalk.blue.bold('source')} table:`),
            createTablePrompt('dest', `Select the ${chalk.yellow.bold('destination')} table:`)
        ])
    );

    await ddbService.copy(source, dest);
}

async function listPrompt() {
    await ddbService.listTables();
}

export { clearPrompt, copyPrompt, listPrompt };

// Utilities
async function createTablePrompt(name: string, message: string) {
    const tablesSource = await ddbService.getTables();
    return {
        type: 'autocomplete',
        name: name,
        message: message,
        pageSize: 5,
        source: (_: unknown, input = '') => fuzzySearch(input, tablesSource)
    };
}
