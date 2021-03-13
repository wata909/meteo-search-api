import { Parser } from "json2csv";
import { ElementScope, AverageScope, SeparatorType } from "./validation";
import { QueryResponse } from "./api";

type APIResponseItem = {
  gridcode: string;
  year: number;
  month?: number;
  day?: number;
  tm?: number;
  pr?: number;
  tn?: number;
  sr?: number;
  tx?: number;
  sd?: number;
};

type AggregationDeployMap = {
  [key: string]: {
    tm: { sum: number; count: number };
    pr: { sum: number; count: number };
    tn: { sum: number; count: number };
    sr: { sum: number; count: number };
    tx: { sum: number; count: number };
    sd: { sum: number; count: number };
  };
};

const getAggregationKey = (
  scope: AverageScope,
  item: { gridcode: string; year: number; month: number; day: number }
) => {
  if (scope === "day") {
    return `${item.gridcode}/${item.year}/${item.month}/${item.day}`;
  } else if (scope === "month") {
    return `${item.gridcode}/${item.year}/${item.month}`;
  } else {
    return `${item.gridcode}/${item.year}`;
  }
};

export const aggregateData = ({
  queryResponse,
  elementScope,
  averageScope,
  separatorType,
}: {
  queryResponse: QueryResponse;
  elementScope: ElementScope;
  averageScope: AverageScope;
  separatorType: SeparatorType;
}): string | APIResponseItem[] => {
  const aggregations = Object.keys(queryResponse).reduce<APIResponseItem[]>(
    (prev, meshCode) => {
      const years = Object.keys(queryResponse[meshCode]);
      years.forEach((yearString) => {
        const year = parseInt(yearString, 10); // !isNaN
        const apiResponse = queryResponse[meshCode][year];
        prev.push(
          ...aggregateEachData(
            year,
            apiResponse,
            meshCode,
            elementScope,
            averageScope
          )
        );
      });
      return prev;
    },
    []
  );

  if (separatorType === "csv") {
    const csvParser = new Parser({ quote: "", eol: "\n" });
    const aggregationsWitoutUndefinedProperties = aggregations.map(
      (aggregation) => {
        (Object.keys(aggregation) as (keyof APIResponseItem)[]).forEach(
          (key) => aggregation[key] === void 0 && delete aggregation[key]
        );
        return aggregation;
      }
    );
    return csvParser.parse(aggregationsWitoutUndefinedProperties);
  } else {
    return aggregations;
  }
};

const aggregateEachData = (
  year: number,
  data: QueryResponse[string][number],
  gridcode: string,
  elementScope: ElementScope,
  averageScope: AverageScope
): APIResponseItem[] => {
  const deployMap = data.reduce<AggregationDeployMap>((prev, row) => {
    const [dateString, tm, pr, tn, sr, tx, sd] = row;
    const [monthString, dayString] = dateString.split("-");
    const month = parseInt(monthString, 10);
    const day = parseInt(dayString, 10);
    const item = {
      gridcode,
      year,
      month,
      day,
      // filter elements
      tm: elementScope.tm ? tm : null,
      pr: elementScope.pr ? pr : null,
      tn: elementScope.tn ? tn : null,
      sr: elementScope.sr ? sr : null,
      tx: elementScope.tx ? tx : null,
      sd: elementScope.sd ? sd : null,
    };
    const key = getAggregationKey(averageScope, item);
    if (!prev[key]) {
      prev[key] = {
        tm: { sum: 0, count: 0 },
        pr: { sum: 0, count: 0 },
        tn: { sum: 0, count: 0 },
        sr: { sum: 0, count: 0 },
        tx: { sum: 0, count: 0 },
        sd: { sum: 0, count: 0 },
      };
    }
    if (typeof item.tm === "number") {
      prev[key].tm.sum += item.tm;
      prev[key].tm.count++;
    }
    if (typeof item.pr === "number") {
      prev[key].pr.sum += item.pr;
      prev[key].pr.count++;
    }
    if (typeof item.tn === "number") {
      prev[key].tn.sum += item.tn;
      prev[key].tn.count++;
    }
    if (typeof item.sr === "number") {
      prev[key].sr.sum += item.sr;
      prev[key].sr.count++;
    }
    if (typeof item.tx === "number") {
      prev[key].tx.sum += item.tx;
      prev[key].tx.count++;
    }
    if (typeof item.sd === "number") {
      prev[key].sd.sum += item.sd;
      prev[key].sd.count++;
    }
    return prev;
  }, {});

  return Object.keys(deployMap).map((key) => {
    const [gridcode, yearString, monthString, dayString] = key.split("/");
    const deployment = deployMap[key];
    const year = parseInt(yearString, 10); // !isNaN
    const month = averageScope !== "year" ? parseInt(monthString, 10) : void 0; // !isNaN
    const day = averageScope === "day" ? parseInt(dayString, 10) : void 0; // !isNaN
    return {
      gridcode,
      year,
      month,
      day,
      tm:
        deployment.tm.count > 0
          ? deployment.tm.sum / deployment.tm.count
          : void 0,
      pr:
        deployment.pr.count > 0
          ? deployment.pr.sum / deployment.pr.count
          : void 0,
      tn:
        deployment.tn.count > 0
          ? deployment.tn.sum / deployment.tn.count
          : void 0,
      sr:
        deployment.sr.count > 0
          ? deployment.sr.sum / deployment.sr.count
          : void 0,
      tx:
        deployment.tx.count > 0
          ? deployment.tx.sum / deployment.tx.count
          : void 0,
      sd:
        deployment.sd.count > 0
          ? deployment.sd.sum / deployment.sd.count
          : void 0,
    };
  });
};
