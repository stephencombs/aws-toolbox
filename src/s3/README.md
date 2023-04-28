# S3 Actions

Below are deeper explanations of what the code is actually doing to increase awareness of actions being performed on your buckets

## Copy

1. A scan is performed to retrieve all of the S3 Buckets on your account
2. A `GetObjectCommand` is sent for each object from the `source` Bucket
3. A `PutObjectCommand` is sent for each object to "copy" them into the destination Bucket

## Clear

1. A scan is performed to retrieve all of the S3 Buckets on your account
2. A `DeleteObjectsCommand` is sent with every object key from the selected Bucket

## Upload

**Not implemented**

## List Objects

1. A scan is performed to retrieve all of the S3 Buckets on your account
2. A scan is performed to retrieve all of the objects from the selected Bucket

## Download

1. A scan is performed to retrieve all of the S3 Buckets on your account
2. A scan is performed to retrieve all of the objects from the selected Bucket
3. A `GetObjectCommand` is sent to retrieve the selected objects data
4. A `writeFileSync` operation is performed on the selected directory
