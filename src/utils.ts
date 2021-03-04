import util from 'util'

export const errorResponse = (statusCode: number, message: string, ...variables: string[]) => {
  return {
      statusCode,
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': 'x-access-token',
      },
      body: JSON.stringify({
          message: util.format(message, ...variables)
      })
  }
}

type DateParams = {
  sy: string | undefined,
  ey: string | undefined,
  sm: string | undefined,
  em: string | undefined,
}

type GeographicalParams = {
  mcode: string | undefined,
}

type QueryDataParams = {
  startYear: number,
  endYear: number,
  startMonth: number,
  endMonth: number,
  meshCode: string
}

type APIResponse = {
  gridcode: string,
  year: number,
  month: number,
  tm: number,
  pr: number
}

export const validateDateRange = ({sy, ey, sm, em}: DateParams) => {
  if(!sy || !ey || !sm || !em) {
    return false
  }
  const startYear = parseInt(sy, 10)
  const endYear = parseInt(ey, 10)
  const startMonth = parseInt(sm, 10)
  const endMonth = parseInt(em, 10)

  if(
      Number.isNaN(startYear) ||
      Number.isNaN(endYear) ||
      Number.isNaN(startMonth) ||
      Number.isNaN(endMonth)
  ) {
    return false
  }
  if(startMonth < 1 || 12 < startMonth || endMonth < 1 || 12 < endMonth) {
    return false
  }
  if(startYear + startMonth / 100 > endYear + endMonth / 100) {
    return false
  }
  return { startYear, endYear, startMonth, endMonth }
}

export const validateGeographicalRange = ({mcode}: GeographicalParams) => {
  if(!mcode || !mcode.match(/[0-9]{7}/)) {
    return false
  }
  return { meshCode: mcode }
}

export const queryData = async (query: QueryDataParams): Promise<APIResponse[]> => {
  // NOTE: This is a mock.
  return [{
    gridcode: "53396111",
    year: 2015,
    month: 3,
    tm: 5.3,
    pr: 2.1
  }]
}
