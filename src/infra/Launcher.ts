import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { UserLambdaStack } from "./stacks/UserLambdaStack";



const app = new App();
const dataStack = new DataStack(app, 'DataStack')
const lambdaStack = new LambdaStack(app, 'LambdaStack', { placesTable: dataStack.placesTable })
const authStack = new AuthStack(app, 'AuthStack')

/* const userLambdaStack = new UserLambdaStack(app, 'UserLambdaStack') */

new ApiStack(app, 'ApiStack', {
    placesLambdaIntegration: lambdaStack.placesLambdaIntegration,
/*     usersLambdaIntegration: userLambdaStack.usersLambdaIntegration, */
    userPool: authStack.userPool
})

