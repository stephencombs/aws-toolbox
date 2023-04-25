import {
    S3Client,
    ListBucketsCommand,
    ListObjectsV2Command,
    DeleteObjectsCommand,
    PutObjectCommand,
    GetObjectCommand
} from '@aws-sdk/client-s3';
import chalk from 'chalk';
import { oraPromise } from 'ora';

export class S3Service {
    private s3Client: S3Client;
    constructor(s3ClientConfig = {}) {
        this.s3Client = new S3Client(s3ClientConfig);
    }

    async getBuckets() {
        const results = await this.s3Client.send(new ListBucketsCommand({}));
        return results.Buckets!.map((bucket) => bucket.Name).filter((name): name is string => !!name) ?? [];
    }

    async getBucketObjects(bucket: string) {
        const results = await oraPromise(
            this.s3Client.send(
                new ListObjectsV2Command({
                    Bucket: bucket
                })
            ),
            {
                text: `Retrieving objects from Bucket ${chalk.blue.bold(bucket)}`,
                successText: `Retrieved objects from Bucket ${chalk.blue.bold(bucket)}`,
                failText: `Failed to retrieve objects from Bucket ${chalk.blue.bold(bucket)}`
            }
        );
        return results.Contents ?? [];
    }

    async clear(bucket: string) {
        const objectKeys = (await this.getBucketObjects(bucket)).map((object) => object.Key);

        const results = await oraPromise(
            this.s3Client.send(
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
                text: `Deleting all objects in ${chalk.blue.bold(bucket)}`,
                successText: `Deletion completed for ${chalk.blue.bold(bucket)}`,
                failText: `Failed during object deletion on ${chalk.blue.bold(bucket)}`
            }
        );

        return results.Deleted?.length ?? 0;
    }

    async copy(source: string, dest: string) {
        const objectKeys = (await this.getBucketObjects(source)).map((object) => object.Key);

        await oraPromise(
            Promise.all(
                objectKeys.map(async (key) => {
                    const object = await this.s3Client.send(
                        new GetObjectCommand({
                            Bucket: source,
                            Key: key
                        })
                    );

                    return this.s3Client.send(
                        new PutObjectCommand({
                            ...object,
                            Bucket: dest,
                            Key: key
                        })
                    );
                })
            ),
            {
                text: `Copying objects from ${chalk.blue.bold(source)} to ${chalk.yellow.bold(dest)}`,
                successText: `Objects from ${chalk.blue.bold(source)} copied to ${chalk.yellow.bold(dest)}`,
                failText: `Failed while copying objects from ${chalk.blue.bold(source)} to ${chalk.yellow.bold(dest)}`
            }
        );
    }
}
