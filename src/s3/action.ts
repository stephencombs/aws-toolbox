import chalk from 'chalk';
import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import { S3Service } from './service.js';
import { fuzzySearch } from '../common/utils.js';

// Register Autocomplete Prompt Type
inquirer.registerPrompt('autocomplete', inquirerPrompt);

const s3Service = new S3Service();

async function clearPrompt() {
    const { name } = await inquirer.prompt([await createTablePrompt('name', `Select a bucket to clear:`)]);
    const { confirmed } = await inquirer.prompt({
        type: 'confirm',
        name: 'confirmed',
        message: `${chalk.red.bold(
            `You are about to delete all objects from ${chalk.blue.bold(name)}, are you sure you want to do this?`
        )}`
    });
    if (confirmed) await s3Service.clear(name);
    return;
}

async function copyPrompt() {
    const { source, dest } = await inquirer.prompt(
        await Promise.all([
            createTablePrompt('source', `Select the ${chalk.blue.bold('source')} bucket:`),
            createTablePrompt('dest', `Select the ${chalk.yellow.bold('destination')} bucket:`)
        ])
    );

    await s3Service.copy(source, dest);
}

async function listObjectsPrompt() {
    const { name } = await inquirer.prompt([await createTablePrompt('name', `Select a bucket:`)]);
    console.log(await s3Service.getBucketObjects(name));
}

export { clearPrompt, copyPrompt, listObjectsPrompt };

async function createTablePrompt(name: string, message: string) {
    const bucketSource = await s3Service.getBuckets();
    return {
        type: 'autocomplete',
        name: name,
        message: message,
        pageSize: 5,
        source: (_: unknown, input = '') => fuzzySearch(input, bucketSource)
    };
}
