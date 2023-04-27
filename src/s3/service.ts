import {
    DeleteObjectsCommand,
    GetObjectCommand,
    ListBucketsCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3ClientConfig
} from '@aws-sdk/client-s3';
import chalk from 'chalk';
import { oraPromise } from 'ora';
import { getS3Client } from '../common/clients.js';
import { boldBlue } from '../common/colors.js';

export class S3Service {
    constructor(readonly s3ClientConfig: S3ClientConfig = {}) {}

    async getBuckets() {
        const results = await getS3Client(this.s3ClientConfig).send(new ListBucketsCommand({}));
        return results.Buckets!.map((bucket) => bucket.Name).filter((name): name is string => !!name) ?? [];
    }

    async getBucketObjects(bucket: string) {
        const results = await oraPromise(
            getS3Client(this.s3ClientConfig).send(
                new ListObjectsV2Command({
                    Bucket: bucket
                })
            ),
            {
                text: `Retrieving objects from Bucket ${boldBlue(bucket)}`,
                successText: `Retrieved objects from Bucket ${boldBlue(bucket)}`,
                failText: `Failed to retrieve objects from Bucket ${boldBlue(bucket)}`
            }
        );
        return results.Contents ?? [];
    }

    async clear(bucket: string) {
        const objectKeys = (await this.getBucketObjects(bucket)).map((object) => object.Key);

        const results = await oraPromise(
            getS3Client(this.s3ClientConfig).send(
                new DeleteObjectsCommand({
                    Bucket: bucket,
                    Delete: {
                        Objects: objectKeys.map((key) => {
                            return {
                                Key: key
                            };
                        })
                    }
                })
            ),
            {
                text: `Deleting all objects in ${boldBlue(bucket)}`,
                successText: `Deletion completed for ${boldBlue(bucket)}`,
                failText: `Failed during object deletion on ${boldBlue(bucket)}`
            }
        );

        return results.Deleted?.length ?? 0;
    }

    async copy(source: string, dest: string) {
        const objectKeys = (await this.getBucketObjects(source)).map((object) => object.Key);

        await oraPromise(
            Promise.all(
                objectKeys.map(async (key) => {
                    const object = await getS3Client(this.s3ClientConfig).send(
                        new GetObjectCommand({
                            Bucket: source,
                            Key: key
                        })
                    );

                    return getS3Client(this.s3ClientConfig).send(
                        new PutObjectCommand({
                            ...object,
                            Bucket: dest,
                            Key: key
                        })
                    );
                })
            ),
            {
                text: `Copying objects from ${boldBlue(source)} to ${chalk.yellow.bold(dest)}`,
                successText: `Objects from ${boldBlue(source)} copied to ${chalk.yellow.bold(dest)}`,
                failText: `Failed while copying objects from ${boldBlue(source)} to ${chalk.yellow.bold(dest)}`
            }
        );
    }
}
