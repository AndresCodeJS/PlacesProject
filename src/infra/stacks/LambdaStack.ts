import { Stack, StackProps } from 'aws-cdk-lib'
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'node:path';


interface LambdaStackProps extends StackProps {
    placesTable: ITable
}


export class LambdaStack extends Stack {

    public readonly placesLambdaIntegration: LambdaIntegration

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props)

        const placesLambda = new NodejsFunction(this, 'HelloLambda', {
            runtime: Runtime.NODEJS_18_X,
            handler: 'handler',
            entry: (join(__dirname, '..', '..', 'services', 'places', 'handler.ts')),
            environment: {
                TABLE_NAME: props.placesTable.tableName
            },
              bundling: {
                  nodeModules: ['uuid'],
              },

        })

        placesLambda.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                'dynamodb:PutItem',
                'dynamodb:DeleteItem',
                'dynamodb:GetItem',
                'dynamodb:UpdateItem',
                'dynamodb:Scan'
            ],
            resources: [props.placesTable.tableArn]

        }))

        /*   placesLambda.addToRolePolicy(new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                  's3:ListAllMyBuckets',
                  's3:ListBucket'
              ],
              resources: ['*'] //bad practice
          })) */

        this.placesLambdaIntegration = new LambdaIntegration(placesLambda)
    }

}