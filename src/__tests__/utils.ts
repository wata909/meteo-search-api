// Test utility for Lambda Handler
export const promisify = (handler: Naro.LambdaHandler) =>
    (
        event: Parameters<Naro.LambdaHandler>[0],
        context: Parameters<Naro.LambdaHandler>[1]
    ) => new Promise((resolve) => {
        // Lambda Proxy Response
        handler(event, context, (_0, result) => {
            resolve(result as any)
        })
    })
