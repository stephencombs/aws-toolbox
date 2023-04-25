#!/usr/bin/env node

import confirm from '@inquirer/confirm';
import select from '@inquirer/select';
import chalk from 'chalk';
import { awsOrange } from './common/colors.js';
import { ddbActionsPrompt } from './ddb/index.js';

const toolboxChoices = [
    {
        name: 'DynamoDB',
        value: 'ddb',
        description: 'Useful options such as copy, clear, etc.'
    },
    {
        name: 'S3',
        value: 's3'
    }
] as const;

// Welcome Message
console.log(' -------------------------------');
console.log(chalk.bold(`  Welcome to the ${awsOrange('AWS Toolbox')} 🧰`));
console.log(' -------------------------------');

async function init() {
    const tool = (await select({
        message: 'Select a service:',
        choices: toolboxChoices as any
    })) as ToolboxChoice;

    switch (tool) {
        case 'ddb':
            await ddbActionsPrompt();
            break;
        case 's3':
            console.log(chalk.yellow('There are currently no actions for S3'));
            break;
    }

    // Check if user would like to perform another action
    const isDone = await confirm({ message: 'Is that your last action?' });
    if (!isDone) await init();
}

// Startup Call
await init();

// Type Definitions
type ToolboxChoice = (typeof toolboxChoices)[number]['value'];