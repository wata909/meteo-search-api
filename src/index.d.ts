import { AttributeValueTarget } from "aws-sdk/clients/redshift";

declare namespace NodeJS {
  interface ProcessEnv {
    readonly ACCESS_TOKEN_SALT: string;
    readonly INCREMENTP_VERIFICATION_API_ENDPOINT: string;
    readonly INCREMENTP_VERIFICATION_API_KEY: string;
  }
}

declare namespace Naro {
  export type LambdaHandler = (
    event: import("aws-lambda").APIGatewayProxyEvent,
    context: any,
    callback: import("aws-lambda").APIGatewayProxyCallback
  ) => void;
}
