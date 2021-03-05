import { Naro } from ".";
import {
  errorResponse,
  validateDateRange,
  validateGeographicalRange,
  validateAverageScope,
  validateSeparatorTypes,
  aggregateData,
  queryData,
} from './utils'

export const handler: Naro.LambdaHandler = async (event, context, callback) => {

    const query = event.queryStringParameters || {}
    // date range
    const {sy, ey, sm, em} = query
    // geographical range
    const { mcode } = query
    // average
    const { average } = query
    // separator
    const { separator } = query

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

    const validatedSeparatorTypes = validateSeparatorTypes({separator})
    if(!validatedSeparatorTypes) {
      return callback(null, errorResponse(400, 'Invalid separator.'))
    }

    const {startYear, endYear, startMonth, endMonth} = dateRange
    const {meshCodes} = geographicalRange
    const {averageScope} = validatedAverageScope
    const {separatorType} = validatedSeparatorTypes

    const meshItemMap = await queryData({startYear, endYear, startMonth, endMonth, meshCodes})
    const aggregations = aggregateData(meshItemMap, averageScope, separatorType)

    const contentType = separatorType === 'csv' ? 'text/csv' : 'application/json'
    const body = separatorType === 'csv' ? aggregations as string : JSON.stringify(aggregations)

    return callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': contentType, // TODO: Lambda Proxy で制御できたか？
        'Access-Control-Allow-Origin': '*',
      },
      body
    });
}
