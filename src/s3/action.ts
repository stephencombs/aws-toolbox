import chalk from 'chalk';
import inquirer from 'inquirer';
import inquirerPrompt from 'inquirer-autocomplete-prompt';
import { boldBlue, boldYellow } from '../common/colors.js';
import { autocomplete, confirm } from '../common/prompts.js';
import { S3Service } from './service.js';

// Register Autocomplete Prompt Type
inquirer.registerPrompt('autocomplete', inquirerPrompt);

const s3Service = new S3Service();

export async function clearPrompt() {
    const bucketNames = await s3Service.getBuckets();
    const { name } = await inquirer.prompt([
        autocomplete({ name: 'name', message: `Select a bucket to clear:`, source: bucketNames })
    ]);
    const { confirmed } = await confirm({
        name: 'confirmed',
        message: `${chalk.red.bold(
            `You are about to delete all objects from ${boldBlue(name)}, are you sure you want to do this?`
        )}`
    });
    if (confirmed) await s3Service.clear(name);
    return;
}

export async function copyPrompt() {
    const bucketNames = await s3Service.getBuckets();
    const { source, dest } = await inquirer.prompt(
        await Promise.all([
            autocomplete({
                name: 'source',
                message: `Select the ${boldBlue('source')} bucket:`,
                source: bucketNames
            }),
            autocomplete({
                name: 'dest',
                message: `Select the ${boldYellow('destination')} bucket:`,
                source: bucketNames
            })
        ])
    );

    await s3Service.copy(source, dest);
}

export async function listObjectsPrompt() {
    const bucketNames = await s3Service.getBuckets();
    const { name } = await inquirer.prompt([
        autocomplete({ name: 'name', message: `Select a bucket:`, source: bucketNames })
    ]);
    console.log(await s3Service.getBucketObjects(name));
}
