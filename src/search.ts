import { Naro } from ".";
import {
  errorResponse,
  validateDateRange,
  validateGeographicalRange,
  validateAverageScope,
  aggregateData,
  queryData
} from './utils'

export const handler: Naro.LambdaHandler = async (event, context, callback) => {

    const query = event.queryStringParameters || {}
    // date range
    const {sy, ey, sm, em} = query
    // geographical range
    const { mcode } = query
    // average
    const { average } = query

    const dateRange = validateDateRange({sy, ey, sm, em})
    if(!dateRange) {
      return callback(null, errorResponse(400, 'Invalid date range.'))
    }

    const geographicalRange = validateGeographicalRange({mcode})
    if(!geographicalRange) {
      return callback(null, errorResponse(400, 'Invalid mesh code.'))
    }

    const validatedAverageScope = validateAverageScope({average})
    if(!validatedAverageScope) {
      return callback(null, errorResponse(400, 'Invalid average.'))
    }

    const {startYear, endYear, startMonth, endMonth} = dateRange
    const {meshCode} = geographicalRange
    const {averageScope} = validatedAverageScope

    const data = await queryData({startYear, endYear, startMonth, endMonth, meshCode})
    const aggregatedData = aggregateData(data, averageScope)

    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data)
    });
}
