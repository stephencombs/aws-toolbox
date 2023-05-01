import {
	DescribeSecretCommand,
	ListSecretsCommand,
	type SecretsManagerClientConfig
} from '@aws-sdk/client-secrets-manager'
import { getSecretsManagerClient } from '../common/clients.js'

export class SecretsService {
	constructor(readonly secretsManagerConfig: SecretsManagerClientConfig = {}) {}

	async getSecrets() {
		const results = await getSecretsManagerClient(this.secretsManagerConfig).send(new ListSecretsCommand({}))
		return (results.SecretList?.map((secret) => secret.Name).filter(Boolean) as string[]) ?? []
	}

	async describe(secret: string) {
		return getSecretsManagerClient(this.secretsManagerConfig).send(
			new DescribeSecretCommand({
				SecretId: secret
			})
		)
	}

	// Async invoke(functionName: string) {
	//     console.log(functionName);
	// }
}
