import merge from "ts-deepmerge";
import { Construct } from 'constructs';
import { ClusterInfo } from "@aws-quickstart/eks-blueprints/dist/spi";
import { HelmAddOn, HelmAddOnProps, HelmAddOnUserProps } from '@aws-quickstart/eks-blueprints/dist/addons/helm-addon';
import { getSecretValue } from "@aws-quickstart/eks-blueprints/dist/utils";

export interface KomodorAddOnProps extends HelmAddOnUserProps {
    /**
     * Your Komdor API key
     */
    apiKey?: string;

    /**
     * Use existing Secret which stores API key instead of creating a new one.
     * The value should be set with the `api-key` key inside the secret.
     * If set, this parameter takes precedence over "apiKey" and "apiKeyAWSSecret".
     */
    apiKeyExistingSecret?: string;

    /**
     * The name of the secret in AWS Secrets Manager which stores the API key.
     * If set, this parameter takes precedence over "apiKey".
     */
    apiKeyAWSSecret?: string;
}

export const defaultProps: HelmAddOnProps & KomodorAddOnProps = {
    chart: "k8s-watcher",
    name: "komodor-addon",
    namespace: "default",
    release: "k8s-watcher",
    repository: "https://helm-charts.komodor.io",
    version: "1.3.4",
    values: {}
};

export class KomdorAddOn extends HelmAddOn {

    readonly options: KomodorAddOnProps;

    constructor(props: KomodorAddOnProps) {
        super({...defaultProps, ...props});
        this.options = this.props as KomodorAddOnProps;
    }

    async deploy(clusterInfo: ClusterInfo): Promise<Construct> {
        let apiKeyValue: string | undefined

        if (this.options.apiKeyAWSSecret) {
            apiKeyValue = await getSecretValue(this.options.apiKeyAWSSecret!, clusterInfo.cluster.stack.region);
        }

        let values = merge({
            Komodor: {
                apiKey: apiKeyValue ? apiKeyValue : this.options.apiKey,
                apiKeyExistingSecret: this.options.apiKeyExistingSecret,
            }
        }, this.options.values ?? {})

        const chart = this.addHelmChart(clusterInfo, values);

        return Promise.resolve(chart);
    }
}
