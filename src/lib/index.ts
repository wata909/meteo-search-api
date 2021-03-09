// Entrypoint for JS client side library

import { _queryData } from "../utils/api";
import {
  validateDateRange,
  validateGeographicalRange,
} from "../utils/validation";
import fetch from "node-fetch";

type Fetch = typeof fetch;

const queryAgroEnvData = (option: any) => {
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
    throw new Error(`Invalid date Range ${JSON.stringify(option)}`);
  }
  if (!geographicalRange) {
    throw new Error(`Invalid geographical Range, ${JSON.stringify(option)}`);
  }

  const endpointFormat =
    option.endpointFormat || process.env.NARO_AGROENV_STATIC_API_ENDPOINT;
  return _queryData(
    (window.fetch as unknown) as Fetch,
    endpointFormat
  )({ ...dateRange, ...geographicalRange });
};

declare global {
  interface Window {
    queryAgroEnvData: any;
  }
}
window.queryAgroEnvData = queryAgroEnvData;
