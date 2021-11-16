// hack to fix a 'common' jest issue'
// https://github.com/sidorares/node-mysql2/issues/489
import * as iconv from 'iconv-lite';
iconv.encodingExists('foo');

import { _handler } from "@handlers/getResults"
import ResultService, { RankedResult } from "@services/resultService"
import { assertResultsAreRanked } from "@test/assertResultsAreRanked"
import fetch from "node-fetch"
import { getConnection, endConnection } from "@lib/mysql";

describe('get results endpoint', () => {
  afterEach(async () => {
    if (getConnection) endConnection()
  })
  it('should fetch all results in ranked order', async () => {
    const data = await new ResultService().getRanked()
    assertResultsAreRanked(data)

    const response = await fetch(process.env.API_URL + '/results')
    const body = await response.text()

    expect(response.status).toEqual(200)
    expect(body).toBeTruthy()
    const results: RankedResult[] = JSON.parse(body)
    expect(results)
      .toEqual(
        expect.arrayContaining(
          data
        )
      )

    assertResultsAreRanked(results)
  })
})