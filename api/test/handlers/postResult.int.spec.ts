import fetch from "node-fetch"
import { Connection } from "mysql2";
// hack to fix a 'common' jest issue'
// https://github.com/sidorares/node-mysql2/issues/489
import * as iconv from 'iconv-lite';
iconv.encodingExists('foo');

// import { getConnection } from "@lib/mysql"
import { RankedResult } from "@services/resultService"

let connection: Connection;

describe('post result endpoint', () => {
  afterEach(() => {
    if (connection) connection.end()
  })
  it('should add a result', async () => {

    const result: any = {
      bib: `B${Math.round(Math.random() * 100)}`,
      name: `Thing ${Math.round(Math.random() * 10)}`,
      time: Math.round(Math.random() * 1000)
    }

    const API_URL = process.env.API_URL + '/results'

    const postResponse = await fetch(
      API_URL,
      {
        body: JSON.stringify(result),
        method: 'POST'
      })
    expect(postResponse.status).toEqual(201)

    const getResponse = await fetch(API_URL)
    expect(getResponse.status).toEqual(200)

    const getResponseBody = await getResponse.text()
    expect(getResponseBody).toBeTruthy()

    const results: RankedResult[] = JSON.parse(getResponseBody)

    expect(results).toContainEqual(
      expect.objectContaining(result)
    )
  })
})
