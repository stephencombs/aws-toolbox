import { LambdaClientConfig, ListFunctionsCommand } from '@aws-sdk/client-lambda';
import { getLambdaClient } from '../common/clients.js';

export class LambdaService {
    constructor(readonly lambdaClientConfig: LambdaClientConfig = {}) {}

    async getFunctions() {
        const results = await getLambdaClient(this.lambdaClientConfig).send(new ListFunctionsCommand({}));
        return results.Functions!.map((lambda) => lambda.FunctionName).filter((name): name is string => !!name) ?? [];
    }

    async invoke(functionName: string) {
        console.log(functionName);
    }
}
