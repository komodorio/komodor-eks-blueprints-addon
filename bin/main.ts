import * as cdk from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { KomdorAddOn } from '../lib';

const app = new cdk.App();

const addOns: Array<blueprints.ClusterAddOn> = [
    new KomdorAddOn({
        // One of these must be uncommented and configured
        // apiKey: '<api key>',
        // apiKeyExistingSecret: '<secret name>'
    })
];

const account = '<account id>'
const region = '<region>'
const stackID = '<stack id>'
const props = { env: { account, region } }

new blueprints.EksBlueprint(app, { id: stackID, addOns}, props)
