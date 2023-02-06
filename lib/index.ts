import merge from "ts-deepmerge";
import { Construct } from 'constructs';
import { ClusterInfo } from "@aws-quickstart/eks-blueprints/dist/spi";
import { HelmAddOn, HelmAddOnProps, HelmAddOnUserProps } from '@aws-quickstart/eks-blueprints/dist/addons/helm-addon';

export interface KomodorAddOnProps extends HelmAddOnUserProps {
    /**
     * Your Komdor API key
     */
    apiKey: string;

    /**
     * Your EKS Cluster name.
     */
    clusterName?: string;
}

export const defaultProps: HelmAddOnProps & KomodorAddOnProps = {
    chart: "k8s-watcher",
    name: "komodor-addon",
    namespace: "default",
    release: "k8s-watcher",
    repository: "https://helm-charts.komodor.io",
    version: "1.3.4",
    apiKey: "",
    values: {
        "watcher.actions.basic": "true",
        "watcher.actions.advanced": "true",
    }
};

export class KomodorAddOn extends HelmAddOn {

    readonly options: KomodorAddOnProps;

    constructor(props: KomodorAddOnProps) {
        super({...defaultProps, ...props});
        this.options = this.props as KomodorAddOnProps;
    }

    async deploy(clusterInfo: ClusterInfo): Promise<Construct> {
        let clusterName: string | undefined

        if (this.options.clusterName) {
            clusterName = this.options.clusterName
        }

        let values = merge({
                apiKey: this.options.apiKey,
                "watcher.clusterName": clusterName,
        }, this.options.values ?? {})

        const chart = this.addHelmChart(clusterInfo, values);

        return Promise.resolve(chart);
    }
}
