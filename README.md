# AWS Toolbox 🧰

[![npm](https://img.shields.io/npm/v/aws-toolbox)](https://www.npmjs.com/package/aws-toolbox)
[![npm](https://img.shields.io/npm/dw/aws-toolbox)](https://www.npmjs.com/package/aws-toolbox)
[![npm](https://img.shields.io/npm/l/aws-toolbox)](https://www.npmjs.com/package/aws-toolbox)

**Complete your work from the terminal, without touching your mouse.**

> _AWS Toolbox aims to provide a variety of handmade tools to help increase your productivity performing menial tasks that would take much longer to find through the Management Console._

_Known issues are tracked [here](./known_issues.md)_

## Installation

Install via using your favorite package manager:

    npm install -g aws-toolbox

then run it from your terminal:

    aws-toolbox

> **Note**
>
> To use this tool you must have valid AWS credentials, it is recommended to use `aws sso login` for this.
>
> For further credential configurations please reference the [official documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html)

## Features

-   [DynamoDB](./src/ddb/README.md)
    -   Copy
    -   Clear
    -   List
-   [S3](./src/s3/README.md)
    -   Copy
    -   Clear
    -   Download

## Contribute

The provided features as of now are use cases that I needed to help improve my workflow with AWS.
Please feel free to contribute to this tool by opening a PR. A template of the files to include is available [here]().

If you see a better way to do something please open a PR/Issue for that as well! By no means is this code perfect.
