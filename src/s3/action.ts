import chalk from 'chalk'
import { writeFileSync } from 'fs'
import inquirer from 'inquirer'
import { boldBlue, boldGreen, boldRed, boldWhite, boldYellow } from '../common/colors.js'
import { autocomplete, confirm, fuzzypath } from '../common/prompts.js'
import { S3Service } from './service.js'
import { paddingTopBottom } from '../common/utils.js'

const s3Service = new S3Service()

export async function clearPrompt() {
	const bucketNames = await s3Service.getBuckets()
	const { name } = await inquirer.prompt([
		autocomplete({ name: 'name', message: `Select a bucket to clear:`, source: bucketNames })
	])
	const { confirmed } = await confirm({
		name: 'confirmed',
		message: `${chalk.red.bold(
			`You are about to delete all objects from ${boldBlue(name)}, are you sure you want to do this?`
		)}`
	})
	if (confirmed) await s3Service.clear(name)
	return
}

export async function copyPrompt() {
	const bucketNames = await s3Service.getBuckets()
	const { source, dest } = await inquirer.prompt([
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

	await s3Service.copy(source, dest)
}

export async function downloadPrompt() {
	// Get the Bucket name
	const bucketNames = await s3Service.getBuckets()
	const { bucket } = await inquirer.prompt([
		autocomplete({ name: 'bucket', message: `Select a bucket:`, source: bucketNames })
	])
	// Get the object Key
	const objectNames = await s3Service.getBucketObjectNames(bucket)
	const { object } = await inquirer.prompt([
		autocomplete({ name: 'object', message: `Select an object:`, source: objectNames })
	])
	// Get the directory to write to
	const { path } = await inquirer.prompt([
		fuzzypath({
			name: 'path',
			message: `Enter a directory to download to:`,
			type: 'directory',
			suggestOnly: true,
			depth: 3
		})
	])

	// Get the object
	const downloadedObject = await s3Service.download(bucket, object)
	if (!downloadedObject) {
		console.error(boldRed(`No Body found for ${object}`))
		return
	}

	// Write the object to the specified path
	writeFileSync(path.concat('/').concat(object), downloadedObject)
	console.log(boldGreen(paddingTopBottom(`Successfully Downloaded ${boldWhite(object)} to ${boldWhite(path)}`)))
}

export async function listObjectsPrompt() {
	const bucketNames = await s3Service.getBuckets()
	const { name } = await inquirer.prompt([
		autocomplete({ name: 'name', message: `Select a bucket:`, source: bucketNames })
	])
	console.log(await s3Service.getBucketObjects(name))
}
