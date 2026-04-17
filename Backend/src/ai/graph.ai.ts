import {
  StateGraph,
  StateSchema,
  type GraphNode,
  START,
  END,
} from '@langchain/langgraph'
import { z } from 'zod'
import { geminiModel, mistralModel, cohereModel } from './model.ai.js'
import { createAgent, HumanMessage, providerStrategy } from 'langchain'

const state = new StateSchema({
  problem: z.string().default(''),
  solution_1: z.string().default(''),
  solution_2: z.string().default(''),
  judge: z.object({
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0),
    // solution_1_reasoning: z.string().default(''),
    // solution_2_reasoning: z.string().default(''),
    reasoning: z.string().default(''),
    recommendation: z.string().default(''),
  }),
})

const solutionNode: GraphNode<typeof state> = async (state) => {
  const [mistralResponse, cohereResponse] = await Promise.all([
    mistralModel.invoke(state.problem),
    cohereModel.invoke(state.problem),
  ])
  return {
    solution_1: mistralResponse.text,
    solution_2: cohereResponse.text,
  }
}

const judgeNode: GraphNode<typeof state> = async (state) => {
  const { problem, solution_1, solution_2 } = state
  const judge = createAgent({
    model: geminiModel,
    responseFormat: providerStrategy(
      z.object({
        solution_1: z.object({
          correctness: z.number().min(0).max(10),
          completeness: z.number().min(0).max(10),
          clarity: z.number().min(0).max(10),
          efficiency: z.number().min(0).max(10),
          robustness: z.number().min(0).max(10),
          overall_score: z.number().min(0).max(10),
        }),
        solution_2: z.object({
          correctness: z.number().min(0).max(10),
          completeness: z.number().min(0).max(10),
          clarity: z.number().min(0).max(10),
          efficiency: z.number().min(0).max(10),
          robustness: z.number().min(0).max(10),
          overall_score: z.number().min(0).max(10),
        }),
        winner: z.enum(['Model 1 Response', 'Model 2 Response']),
        confidence: z.number().min(0).max(1),
        reasoning: z.string(),
        tie_break_reason: z.string().optional(),
      }),
    ),
    systemPrompt: `
You are an expert technical evaluator tasked with comparing two AI solutions to a given problem.

## Problem:
${problem}

## Solution 1:
${solution_1}

## Solution 2:
${solution_2}

---

## Evaluation Criteria (strictly follow all):
Evaluate BOTH solutions independently based on:

1. Correctness -> 40% (Is the solution logically and factually correct?)
2. Completeness -> 20% (Does it fully solve the problem?)
3. Clarity -> 15% (Is it well-explained and easy to understand?)
4. Efficiency -> 15% (Is the approach optimal or unnecessarily complex?)
5. Robustness -> 10% (Does it handle edge cases or real-world scenarios?)

Each criterion should be scored on a scale of 0 to 10. Then calculate an overall_score for each solution based on the criteria weights.

---

## Instructions:
1. Score BOTH solutions on ALL criteria.

2. Calculate overall_score using:
   - overall_score = (correctness * 0.4) + (completeness * 0.2) + (clarity * 0.15) + (efficiency * 0.15) + (robustness * 0.1)

3. Select the winner based on the higher overall_score.

4. If scores are equal:
- Choose based on clarity + completeness
- Provide tie_break_reason

5. Provide confidence score:
- 0 → unsure
- 1 → very confident
- Base it on difference in scores + quality gap

6. Penalize hallucinations heavily.
7. Be strict and unbiased.

---

## Output Rules (STRICT):
Return ONLY valid JSON.

- winner MUST be:
  "Model 1 Response" OR "Model 2 Response"

---

## Output Format (STRICT JSON ONLY):
{
  "solution_1": {
    "correctness": number,
    "completeness": number,
    "clarity": number,
    "efficiency": number,
    "robustness": number,
    "overall_score": number
  },
  "solution_2": {
    "correctness": number,
    "completeness": number,
    "clarity": number,
    "efficiency": number,
    "robustness": number,
    "overall_score": number
  },
  "winner": "Model 1 Response" | "Model 2 Response",
  "confidence": number,
  "reasoning": "Detailed comparison explaining why scores were assigned",
  "tie_break_reason": "If applicable, explain why the winner was chosen in case of a tie. Omit this field if there was no tie."
}
`,
  })
  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(`
                Problem: ${problem}
                Solution 1: ${solution_1}
                Solution 2: ${solution_2}
                Please evaluate both solutions based on the criteria and provide scores, reasoning, and a recommended model solution.
            `),
    ],
  })

  const result = judgeResponse.structuredResponse

  if (!result || !result.solution_1 || !result.solution_2) {
    throw new Error('Judge failed to produce valid structured response')
  }

  return {
    judge: {
      solution_1: result.solution_1,
      solution_2: result.solution_2,
      winner: result.winner,
      confidence: result.confidence,
      reasoning: result.reasoning,
      tie_break_reason: result.tie_break_reason || '',
    },
  }
}

const graph = new StateGraph(state)
  .addNode('solution', solutionNode)
  .addNode('judge_node', judgeNode)
  .addEdge(START, 'solution')
  .addEdge('solution', 'judge_node')
  .addEdge('judge_node', END)
  .compile()

export default async function (userMessage: string) {
  const result = await graph.invoke({
    problem: userMessage,
  })
  return result
}
