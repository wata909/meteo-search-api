type DateParams = {
  sy: string | undefined;
  ey: string | undefined;
  sm: string | undefined;
  em: string | undefined;
};

type GeographicalParams = {
  mcode: string | undefined;
};

type ElementScopeParams = {
  element: string | undefined;
};

type AverageScopeParams = {
  average: string | undefined;
};

type SeparatorTypesParams = {
  separator: string | undefined;
};

type ElementType = "tm" | "pr" | "tn" | "sr" | "tx" | "sd";
const allElementTypes: ElementType[] = ["tm", "pr", "tn", "sr", "tx", "sd"];

export type AverageScope = "day" | "month" | "year";

export type SeparatorType = "csv" | "json";

type ElementScope = {
  [element in ElementType]?: boolean;
};

type QueryDataParams = {
  startYear: number;
  endYear: number;
  startMonth: number;
  endMonth: number;
  meshCodes: string[];
};

type StaticAPIResponseItem = [
  d: string,
  tm: number | null,
  pr: number | null,
  tn: number | null,
  sr: number | null,
  tx: number | null,
  sd: number | null
];

export type QueryResponse = {
  [meshCode: string]: StaticAPIResponseItem[];
};

export const validateDateRange = ({ sy, ey, sm, em }: DateParams) => {
  if (!sy || !ey || !sm || !em) {
    return false;
  }
  const startYear = parseInt(sy, 10);
  const endYear = parseInt(ey, 10);
  const startMonth = parseInt(sm, 10);
  const endMonth = parseInt(em, 10);

  if (
    Number.isNaN(startYear) ||
    Number.isNaN(endYear) ||
    Number.isNaN(startMonth) ||
    Number.isNaN(endMonth)
  ) {
    return false;
  }
  if (startMonth < 1 || 12 < startMonth || endMonth < 1 || 12 < endMonth) {
    return false;
  }
  if (startYear + startMonth / 100 > endYear + endMonth / 100) {
    return false;
  }
  return { startYear, endYear, startMonth, endMonth };
};

export const validateGeographicalRange = ({ mcode }: GeographicalParams) => {
  if (!mcode || typeof mcode !== "string") {
    return false;
  }
  const meshCodes = mcode.split(",");
  if (meshCodes.some((meshCode) => !meshCode.match(/([0-9]{7})+/))) {
    return false;
  }
  return { meshCodes };
};

export const validateElementScope = ({ element }: ElementScopeParams) => {
  let allowedElementTypes: ElementType[];
  if (!element || element.toUpperCase() === "ALL") {
    allowedElementTypes = allElementTypes;
  } else {
    allowedElementTypes = element.split(",").filter((element, index, self) => {
      return (
        self.indexOf(element) === index &&
        allElementTypes.includes(element as ElementType)
      );
    }) as ElementType[];
  }

  if (allowedElementTypes.length === 0) {
    return false;
  }

  const elementScope = allElementTypes.reduce<ElementScope>((prev, element) => {
    prev[element] = allowedElementTypes.includes(element);
    return prev;
  }, {});

  return { elementScope };
};

export const validateAverageScope = ({
  average,
}: AverageScopeParams): false | { averageScope: AverageScope } => {
  if (!average || average.toUpperCase() === "DAY") {
    return { averageScope: "day" as const };
  } else if (average.toUpperCase() === "MONTH") {
    return { averageScope: "month" as const };
  } else if (average.toUpperCase() === "YEAR") {
    return { averageScope: "year" as const };
  }
  return false;
};

export const validateSeparatorTypes = ({ separator }: SeparatorTypesParams) => {
  if (!separator || separator.toUpperCase() === "JSON") {
    return { separatorType: "json" as const };
  } else if (separator.toUpperCase() === "CSV") {
    return { separatorType: "csv" as const };
  }
  return false;
};
