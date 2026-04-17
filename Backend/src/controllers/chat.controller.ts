import runGraph from '../ai/graph.ai.js'
import express from 'express'

export const sendMessage = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { problem } = req.body
    if (!problem || typeof problem !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Problem is required and must be a string',
      })
    }
    const graphResult = await runGraph(problem)
    res.status(200).json({ success: true, graph_result: graphResult })
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ success: false, error: errorMessage })
  }
}

export default {
  sendMessage,
}
