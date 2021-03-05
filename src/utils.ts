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

type AverageScopeParams = {
  average: string | undefined
}

type SeparatorTypesParams = {
  separator: string | undefined,
}

type AverageScope = 'day' | 'month' | 'year'

type SeparatorType = 'csv' | 'json'

type QueryDataParams = {
  startYear: number,
  endYear: number,
  startMonth: number,
  endMonth: number,
  meshCodes: string[]
}

type StaticAPIResponseItem = [
  d: string,
  tm: number | null,
  pr: number | null,
  tn: number | null,
  sr: number | null,
  tx: number | null,
  sd: number | null,
]

type APIResponseItem = {
  gridcode: string,
  year: number,
  month: number | undefined,
  day: number | undefined,
  tm: number | null,
  pr: number | null,
  tn: number | null,
  sr: number | null,
  tx: number | null,
  sd: number | null,
}

export type QueryResponse = {
  [meshCode: string]: StaticAPIResponseItem[],
}

type AggregationDeployMap = { [key: string]: {
  tm: { sum: number, count: number },
  pr: { sum: number, count: number },
  tn: { sum: number, count: number },
  sr: { sum: number, count: number },
  tx: { sum: number, count: number },
  sd: { sum: number, count: number },
} }

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
  if(!mcode || typeof mcode !== 'string') {
    return false
  }
  const meshCodes = mcode.split(',')
  if(meshCodes.some(meshCode => !meshCode.match(/([0-9]{7})+/))) {
    return false
  }
  return { meshCodes }
}

export const validateAverageScope = ({average}: AverageScopeParams) => {
  if(!average || average.toUpperCase() === 'DAY') {
    return {averageScope: 'day' as 'day'}
  } else if(average.toUpperCase() === 'MONTH') {
    return {averageScope: 'month' as 'month'}
  } else if(average.toUpperCase() === 'YEAR') {
    return {averageScope: 'year' as 'year'}
  }
  return false
}

export const validateSeparatorTypes = ({separator}: SeparatorTypesParams) => {
  if(!separator || separator.toUpperCase() === 'JSON') {
    return { separatorType: 'json' as 'json' }
  } else if(separator.toUpperCase() === 'CSV') {
    return {separatorType: 'csv' as 'csv'}
  }
  return false
}

export const queryData = async (query: QueryDataParams): Promise<QueryResponse> => {
  // NOTE: This is a mock.
  const apiResponse: StaticAPIResponseItem[] = [
    ["2015-3-1", 5.3, 2.1, 1.2, 3.7, 1.5, 1.2]
  ]
  return query.meshCodes.reduce<QueryResponse>((prev, meshCode) => {
    prev[meshCode] = apiResponse
    return prev
  }, {})
}

const getDeployKey = (scope: AverageScope, item: {gridcode: string, year: number, month: number, day: number}) => {
  if(scope === 'day') {
    return `${item.gridcode}/${item.year}/${item.month}/${item.day}`
  } else if(scope === 'month') {
    return `${item.gridcode}/${item.year}/${item.month}`
  } else {
    return `${item.gridcode}/${item.year}`
  }
}

export const aggregateData = (data: QueryResponse, averageScope: AverageScope, separatorType: SeparatorType) => {
  const aggregations = Object.keys(data).reduce<APIResponseItem[]>((prev, meshCode) => {
    const apiResponse = data[meshCode]
    prev.push(...aggregateEachData(apiResponse, meshCode, averageScope))
    return prev
  }, [])
  if(separatorType === 'csv') {
    let header = ''
    let rows = ''
    if(averageScope === 'year') {
      header = `gridcode,year,tm,pr,tn,sr,tx,sd`
      rows = aggregations.map(item => `${item.gridcode},${item.year},${item.tm},${item.pr},${item.tn},${item.sr},${item.tx},${item.sd}`).join('\n')
    } else if(averageScope === 'month') {
      header = `gridcode,year,month,tm,pr,tn,sr,tx,sd`
      rows = aggregations.map(item => `${item.gridcode},${item.year},${item.month},${item.tm},${item.pr},${item.tn},${item.sr},${item.tx},${item.sd}`).join('\n')
    } else {
      header = `gridcode,year,month,day,tm,pr,tn,sr,tx,sd`
      rows = aggregations.map(item => `${item.gridcode},${item.year},${item.month},${item.day},${item.tm},${item.pr},${item.tn},${item.sr},${item.tx},${item.sd}`).join('\n')
    }
    return `${header}\n${rows}`
  } else {
    return aggregations
  }
}

const aggregateEachData = (data: StaticAPIResponseItem[], gridcode: string, averageScope: AverageScope) => {

    const deployMap = data.reduce<AggregationDeployMap>((prev, row) => {
      const [dateString, tm, pr, tn, sr, tx, sd] = row
      const [yearString, monthString, dayString] = dateString.split('-')
      const year = parseInt(yearString, 10)
      const month = parseInt(monthString, 10)
      const day = parseInt(dayString, 10)
      const item = {
        gridcode,
        year,
        month,
        day,
        tm, pr, tn, sr, tx, sd
      }
      const key = getDeployKey(averageScope, item)
      if(!prev[key]) {
        prev[key] = {
          tm: {sum: 0,count: 0},
          pr: {sum: 0,count: 0},
          tn: {sum: 0,count: 0},
          sr: {sum: 0,count: 0},
          tx: {sum: 0,count: 0},
          sd: {sum: 0,count: 0},
        }
      }
      if(typeof item.tm === 'number') {
        prev[key].tm.sum += item.tm
        prev[key].tm.count++
      }
      if(typeof item.pr === 'number') {
        prev[key].pr.sum += item.pr
        prev[key].pr.count++
      }
      if(typeof item.tn === 'number') {
        prev[key].tn.sum += item.tn
        prev[key].tn.count++
      }
      if(typeof item.sr === 'number') {
        prev[key].sr.sum += item.sr
        prev[key].sr.count++
      }
      if(typeof item.tx === 'number') {
        prev[key].tx.sum += item.tx
        prev[key].tx.count++
      }
      if(typeof item.sd === 'number') {
        prev[key].sd.sum += item.sd
        prev[key].sd.count++
      }
      return prev
    }, {})

    return Object.keys(deployMap).map(key => {
      const [gridcode, yearString, monthString, dayString] = key.split('/')
      const deployment = deployMap[key]
      const year = parseInt(yearString, 10) // !isNaN
      const month = averageScope !== 'year' ? parseInt(monthString, 10) : void 0 // !isNaN
      const day = averageScope === 'day' ? parseInt(dayString, 10): void 0 // !isNaN
      return {
        gridcode,
        year,
        month,
        day,
        tm: deployment.tm.count > 0 ? deployment.tm.sum / deployment.tm.count : null,
        pr: deployment.pr.count > 0 ? deployment.pr.sum / deployment.pr.count : null,
        tn: deployment.tn.count > 0 ? deployment.tn.sum / deployment.tn.count : null,
        sr: deployment.sr.count > 0 ? deployment.sr.sum / deployment.sr.count : null,
        tx: deployment.tx.count > 0 ? deployment.tx.sum / deployment.tx.count : null,
        sd: deployment.sd.count > 0 ? deployment.sd.sum / deployment.sd.count : null,
      }
    })
  }

