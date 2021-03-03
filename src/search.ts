

export const handler: Naro.LambdaHandler = async (event, context, callback) => {

    const result = {}

    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': '',
      },
      body: JSON.stringify({})
    });
}
