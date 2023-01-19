import * as cdk from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { KomdorAddOn } from '../lib';

const app = new cdk.App();

const account = '<account id>'
const region = '<region>'
const clusterName = '<cluster name>'
const props = { env: { account, region } }

const addOns: Array<blueprints.ClusterAddOn> = [
    new KomdorAddOn({
        apiKey: '<api key>',
        clusterName: clusterName,
    })
];

new blueprints.EksBlueprint(app, { id: clusterName, addOns}, props)
