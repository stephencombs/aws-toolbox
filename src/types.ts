type ToolChoice = "ddb" | "s3";

type DynamoDBChoice = "copy" | "clear" | "list";

export type Choice = ToolChoice | DynamoDBChoice;
