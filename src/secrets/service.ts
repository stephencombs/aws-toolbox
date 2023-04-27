import { DescribeSecretCommand, ListSecretsCommand, SecretsManagerClientConfig } from '@aws-sdk/client-secrets-manager'
import { getSecretsManagerClient } from '../common/clients.js'

export class SecretsService {
	constructor(readonly secretsManagerConfig: SecretsManagerClientConfig = {}) {}

	async getSecrets() {
		const results = await getSecretsManagerClient(this.secretsManagerConfig).send(new ListSecretsCommand({}))
		return results.SecretList!.map((secret) => secret.Name).filter((name): name is string => !!name) ?? []
	}

	async describe(secret: string) {
		return await getSecretsManagerClient(this.secretsManagerConfig).send(
			new DescribeSecretCommand({
				SecretId: secret
			})
		)
	}

	// async invoke(functionName: string) {
	//     console.log(functionName);
	// }
}
