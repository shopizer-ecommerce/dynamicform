//const { Stack, Duration } = require('aws-cdk-lib');
// const sqs = require('aws-cdk-lib/aws-sqs');

/**

class DeploymentStack extends Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'DeploymentQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });
  }
}

//module.exports = { DeploymentStack }

**/


// Import necessary CDK modules
const { Stack, App, Duration } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib').aws_s3; 
const cloudfront = require('aws-cdk-lib').aws_cloudfront;
const cdk = require('aws-cdk-lib');
//const { Bucket, BucketAccessControl } = require('@aws-cdk/aws-s3');
//const { CloudFrontWebDistribution } = require('@aws-cdk/aws-cloudfront');
//const { ARecord, RecordTarget } = require('@aws-cdk/aws-route53');
//const { HostedZone } = require('@aws-cdk/aws-route53');
//const { CloudFrontTarget } = require('@aws-cdk/aws-route53-targets');

class DeploymentStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Create an S3 bucket for your website content
    const websiteBucket = new s3.Bucket(this, 'DynamicFormBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }
    });

    // Restrict public access permissions
    websiteBucket.grantPublicAccess('*', 's3:GetObject');

    // Create CloudFront distribution
    const cloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(this, 'DeploymentStackDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: websiteBucket
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    });

    // Optionally, you can configure a custom domain with Route 53
    //const hostedZoneId = '<your-hosted-zone-id>'; // Replace with your Route 53 Hosted Zone ID
    //const domainName = '<your-domain-name>'; // Replace with your custom domain name

    //const zone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
    //  hostedZoneId: hostedZoneId,
    //  zoneName: domainName
    //});

    // Create DNS record to map your domain to CloudFront distribution
    //new ARecord(this, 'WebsiteAliasRecord', {
    //  zone: zone,
    //  target: RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontDistribution))
    //});
  }
}

module.exports = { DeploymentStack }