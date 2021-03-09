import AWSLamnbda from "aws-lambda";

type LambdaHandler = (
  event: AWSLamnbda.APIGatewayProxyEvent,
  context: AWSLamnbda.Context,
  callback: AWSLamnbda.APIGatewayProxyCallback
) => void;

import { errorResponse } from "./utils/format";
import { queryData } from "./utils/api";
import { aggregateData } from "./utils/aggregation";

import {
  validateDateRange,
  validateGeographicalRange,
  validateElementScope,
  validateAverageScope,
  validateSeparatorTypes,
} from "./utils/validation";

export const handler: LambdaHandler = async (event, _1, callback) => {
  const query = event.queryStringParameters || {};

  // backward compatibility
  const { pcode, rcode, mtype, callback: jsonpcallback } = query;

  if (pcode) {
    return callback(null, errorResponse(400, "Invalid pcode parameter."));
  } else if (rcode) {
    return callback(null, errorResponse(400, "Invalid rcode parameter."));
  } else if (mtype !== "me") {
    return callback(null, errorResponse(400, "Invalid mtype parameter."));
  } else if (jsonpcallback) {
    return callback(null, errorResponse(400, "Invalid callback parameter."));
  }

  // date range
  const { sy, ey, sm, em } = query;
  // geographical range
  const { mcode } = query;
  // element
  const { element } = query;
  // average
  const { average } = query;
  // separator
  const { separator } = query;

  const dateRange = validateDateRange({ sy, ey, sm, em });
  if (!dateRange) {
    return callback(
      null,
      errorResponse(400, "Invalid sy, ey, sm or em paramters.")
    );
  }

  const geographicalRange = validateGeographicalRange({ mcode });
  if (!geographicalRange) {
    return callback(null, errorResponse(400, "Invalid mcode paramter."));
  }

  const validatedElementScope = validateElementScope({ element });
  if (!validatedElementScope) {
    return callback(null, errorResponse(400, "Invalid element parameter."));
  }

  const validatedAverageScope = validateAverageScope({ average });
  if (!validatedAverageScope) {
    return callback(null, errorResponse(400, "Invalid average paramter."));
  }

  const validatedSeparatorTypes = validateSeparatorTypes({ separator });
  if (!validatedSeparatorTypes) {
    return callback(null, errorResponse(400, "Invalid separator paramter."));
  }

  const { startYear, endYear, startMonth, endMonth } = dateRange;
  const { meshCodes } = geographicalRange;
  const { elementScope } = validatedElementScope;
  const { averageScope } = validatedAverageScope;
  const { separatorType } = validatedSeparatorTypes;

  const queryResponse = await queryData({
    startYear,
    endYear,
    startMonth,
    endMonth,
    meshCodes,
  });
  const aggregations = aggregateData({
    queryResponse,
    elementScope,
    averageScope,
    separatorType,
  });

  const contentType = separatorType === "csv" ? "text/csv" : "application/json";
  const body =
    separatorType === "csv"
      ? (aggregations as string)
      : JSON.stringify(aggregations);

  return callback(null, {
    statusCode: 200,
    headers: {
      "Content-Type": contentType, // TODO: Lambda Proxy で制御できたか？
      "Access-Control-Allow-Origin": "*",
    },
    body,
  });
};
