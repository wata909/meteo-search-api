import {
  validateAverageScope,
  validateDateRange,
  validateGeographicalRange,
  aggregateData
} from './utils'

test('should validate date range', () => {
  const result = validateDateRange({sy: '2000', sm: '1', ey: '2001', em: '05'})
  if(!result) {
    throw new Error('invalid')
  } else {
    const {startYear, endYear, startMonth, endMonth} = result
    expect(startYear).toEqual(2000)
    expect(endYear).toEqual(2001)
    expect(startMonth).toEqual(1)
    expect(endMonth).toEqual(5)
  }
})

test('should not validate date range', () => {
  const result = validateDateRange({sy: '2010', sm: '1', ey: '2001', em: '05'})
  expect(result).toBe(false)
})

test('should validate geographical range', () => {
  const result = validateGeographicalRange({mcode: '60417050'})
  expect(result).toEqual({meshCode: '60417050'})
})

test('should not validate geographical range', () => {
  const result = validateGeographicalRange({mcode: 'aaaaa'})
  expect(result).toEqual(false)
})

test('should validate average scope', () => {
  const result = validateAverageScope({average: 'month'})
  expect(result).toEqual({averageScope: 'month'})
})

test('should not validate average scope', () => {
  const result = validateAverageScope({average: 'bbbbb'})
  expect(result).toEqual(false)
})

test('should aggregate data by month', () => {
  const data = [
    { gridcode: '111', year: 2001, month: 1, day: 1, tm: 1, pr: 10, tn: null, sr: null, tx: null, sd: null  },
    { gridcode: '111', year: 2001, month: 1, day: 2, tm: 2, pr: 12, tn: null, sr: null, tx: null, sd: null  },
    { gridcode: '111', year: 2001, month: 1, day: 3, tm: 3, pr: 17, tn: null, sr: null, tx: null, sd: null  },
    { gridcode: '111', year: 2001, month: 2, day: 1, tm: 2, pr: 11, tn: null, sr: null, tx: null, sd: null  },
    { gridcode: '111', year: 2001, month: 2, day: 2, tm: 3, pr: 14, tn: null, sr: null, tx: null, sd: null  },
    { gridcode: '111', year: 2001, month: 2, day: 3, tm: 4, pr: 17, tn: null, sr: null, tx: null, sd: null  },
  ]
  const result = aggregateData(data, 'month')
  expect(result).toEqual(
    [
      { gridcode: '111', year: 2001, month: 1, tm: 2, pr: 13 },
      { gridcode: '111', year: 2001, month: 2, tm: 3, pr: 14 },
    ]
  )
})

test('should aggregate data by year', () => {
  const data = [
    { gridcode: '111', year: 2001, month: 1, day: 1, tm: 1, pr: 10, tn: null, sr: null, tx: null, sd: null },
    { gridcode: '111', year: 2001, month: 1, day: 2, tm: 2, pr: 12, tn: null, sr: null, tx: null, sd: null },
    { gridcode: '111', year: 2001, month: 1, day: 3, tm: 3, pr: 17, tn: null, sr: null, tx: null, sd: null },
    { gridcode: '111', year: 2002, month: 2, day: 1, tm: 2, pr: 11, tn: null, sr: null, tx: null, sd: null },
    { gridcode: '111', year: 2002, month: 2, day: 2, tm: 3, pr: 14, tn: null, sr: null, tx: null, sd: null },
    { gridcode: '111', year: 2002, month: 2, day: 3, tm: 4, pr: 17, tn: null, sr: null, tx: null, sd: null },
  ]
  const result = aggregateData(data, 'year')
  expect(result).toEqual(
    [
      { gridcode: '111', year: 2001, tm: 2, pr: 13 },
      { gridcode: '111', year: 2002, tm: 3, pr: 14 },
    ]
  )
})

test('should aggregate data by gridcode', () => {
  const data = [
    { gridcode: '111', year: 2001, month: 1, day: 1, tm: 1, pr: 10, tn: null, sr: null, tx: null, sd: null  },
    { gridcode: '111', year: 2001, month: 1, day: 2, tm: 2, pr: 12, tn: null, sr: null, tx: null, sd: null  },
    { gridcode: '111', year: 2001, month: 1, day: 3, tm: 3, pr: 17, tn: null, sr: null, tx: null, sd: null  },
    { gridcode: '222', year: 2001, month: 1, day: 1, tm: 2, pr: 11, tn: null, sr: null, tx: null, sd: null  },
    { gridcode: '222', year: 2001, month: 1, day: 2, tm: 3, pr: 14, tn: null, sr: null, tx: null, sd: null  },
    { gridcode: '222', year: 2001, month: 1, day: 3, tm: 4, pr: 17, tn: null, sr: null, tx: null, sd: null  },
  ]
  const result = aggregateData(data, 'month')
  expect(result).toEqual(
    [
      { gridcode: '111', year: 2001, month: 1, tm: 2, pr: 13 },
      { gridcode: '222', year: 2001, month: 1, tm: 3, pr: 14 },
    ]
  )
})
