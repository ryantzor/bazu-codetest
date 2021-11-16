/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from "react"
import { toHhMmSs } from "../time";
import { RankedResult } from "./types";

export default () => {
  const [results, setResults] = useState<RankedResult[]>()
  useEffect(() => {
    const getResults = async () => {
      const response = await fetch(`http://localhost:5000/results`)
      const data = await response.json() as Array<RankedResult>
      setResults(data)
    }
    getResults()
  }, [])

  const ResultsView = () => {
    if (results) {
      return (
      <>
      {results?.map(x => (
        <tr key={x.bib}>
          <td data-testclass='bib'>{x.bib}</td>
          <td data-testclass='name'>{x.name}</td>
          <td data-testclass='time'>{toHhMmSs(x.time)}</td>
          <td data-testclass='rank'>{x.rank}</td>
        </tr>
      ))}
      </>
      )
    } else {
      return <tr>no data</tr>
    }
  }

  return (
    <div className='results' data-testid='results'>
      <table>
        <thead>
          <tr>
            <th>Bib</th>
            <th>Name</th>
            <th>Time</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          <ResultsView />
        </tbody>
      </table>
    </div>
  )
}

