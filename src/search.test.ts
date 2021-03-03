import { promisify } from './__tests__/utils'
import { handler } from './search'

test('should parse qs.', async () => {
  const search = promisify(handler)
  // @ts-ignore
  const result = await search({}, {})
  expect(true).toBe(false)
})
