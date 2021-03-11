// Entrypoint for JS client side library

import { _queryData } from "../utils/api";
import {
  validateDateRange,
  validateGeographicalRange,
} from "../utils/validation";
import { aggregateData } from "../utils/aggregation";
import fetch from "node-fetch";

type Fetch = typeof fetch;

const queryAgroEnvData = async (option: any) => {
  const sy =
    option.startYear === void 0 ? void 0 : option.startYear.toString(10);
  const ey = option.endYear === void 0 ? void 0 : option.endYear.toString(10);
  const sm =
    option.startMonth === void 0 ? void 0 : option.startMonth.toString(10);
  const em = option.endMonth === void 0 ? void 0 : option.endMonth.toString(10);
  const mcode = option.gridcodes.join(",");

  const dateRange = validateDateRange({ sy, ey, sm, em });
  const geographicalRange = validateGeographicalRange({ mcode });

  if (!dateRange) {
    throw new Error(`Invalid date Range, ${JSON.stringify(option)}`);
  }
  if (!geographicalRange) {
    throw new Error(`Invalid geographical Range, ${JSON.stringify(option)}`);
  }

  // implicit options
  const average = option.average || "day";
  const separator = option.separator || "json";

  if (average !== "year" && average !== "month" && average !== "day") {
    throw new Error(`Invalid average parameter, ${JSON.stringify(option)}`);
  }

  if (separator !== "json" && separator !== "csv") {
    throw new Error(`Invalid separator parameter, ${JSON.stringify(option)}`);
  }

  const endpointFormat =
    option.endpointFormat || process.env.AGRO_ENV_STATIC_API_ENDPOINT;
  const queryResponse = await _queryData(
    (window.fetch as unknown) as Fetch,
    endpointFormat
  )({ ...dateRange, ...geographicalRange });

  const aggregations = aggregateData({
    queryResponse,
    elementScope: {
      tm: true,
      pr: true,
      tn: true,
      sr: true,
      tx: true,
      sd: true,
    },
    averageScope: average, // 'day' as default
    separatorType: separator, // 'json' as default
  });

  return aggregations;
};

declare global {
  interface Window {
    queryAgroEnvData: any;
  }
}
window.queryAgroEnvData = queryAgroEnvData;
