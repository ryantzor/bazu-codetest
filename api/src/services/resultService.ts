import { getConnection } from "@lib/mysql"
import { RowDataPacket } from "mysql2"
interface IUnrankedResult extends RowDataPacket {
  bib: string
  name: string
  time: number
}

export interface IRankedResult extends IUnrankedResult  {
  rank: number
}

export type UnrankedResult = {
  bib: string
  name: string
  time: number
}


export type RankedResult = UnrankedResult & {
  rank: number
}


export interface IResultService {
  addResult(result: UnrankedResult): Promise<void>
  getRanked(): Promise<RankedResult[]>
}

export default class ResultService implements IResultService {

  async addResult(result: UnrankedResult): Promise<void> {
    const connection = await getConnection()
    await connection.query(`insert into results (bib, name, time) values (?, ?, ?)`, [result.bib, result.name, result.time])
  }

  async getRanked(): Promise<RankedResult[]> {
    let ranked: IUnrankedResult[] = []
    const connection = await getConnection()
    const [rows] = await connection.query<IUnrankedResult[]>("SELECT * FROM results", [])
    ranked.push(...rows)
    ranked.sort((a, b) => a.time < b.time
      ? -1
      : a.time > b.time
        ? 1
        : 0
    );
    return ranked.map<IRankedResult>((x, i) => ({
      ...x,
      rank: i + 1
    }));
  }

}