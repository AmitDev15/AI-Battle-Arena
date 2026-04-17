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
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
        reasoning: z.string(),
        recommended_response: z.enum(['Model 1 Response', 'Model 2 Response']),
        // solution_1_reasoning: z.string(),
        // solution_2_reasoning: z.string(),
      }),
    ),
    systemPrompt: `
You are an expert technical evaluator tasked with comparing two solutions to a given problem.

## Problem:
${problem}

## Solution 1:
${solution_1}

## Solution 2:
${solution_2}

---

## Evaluation Criteria (strictly follow all):
Evaluate BOTH solutions independently based on:

1. Correctness (Is the solution logically and factually correct?)
2. Completeness (Does it fully solve the problem?)
3. Clarity (Is it well-explained and easy to understand?)
4. Efficiency (Is the approach optimal or unnecessarily complex?)
5. Robustness (Does it handle edge cases or real-world scenarios?)

---

## Instructions:
- Penalize hallucinations heavily.
- Prefer solutions with examples or code if relevant.
- If both solutions are weak, still choose the better one but explain flaws.
- Give a score between 0 and 10 for each solution.
- Be strict and unbiased.
- Do NOT give the same score unless both are truly equal.
- Prefer depth, correctness, and practical usability over verbosity.

---

## Output Rules (STRICT):
Return ONLY valid JSON.

"recommended_response" MUST be exactly one of:
- "Model 1 Response"
- "Model 2 Response"

Do NOT output anything else.
Do NOT rephrase.
Do NOT include explanations in this field.

---

## Decision Rule:
- If solution_1_score > solution_2_score → "Model 1 Response"
- If solution_2_score > solution_1_score → "Model 2 Response"
- If equal → choose the better one based on clarity & completeness

## Output Format (STRICT JSON ONLY):
{
  "solution_1_score": number,
  "solution_2_score": number,
  "reasoning": "Detailed comparison explaining why scores were assigned",
  "recommended_response": MUST be exactly one of:
- "Model 1 Response"
- "Model 2 Response"
- "Model 1 or Model 2 Response"(If equal → choose the better one based on clarity & completeness)
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

  const {
    solution_1_score,
    solution_2_score,
    reasoning,
    recommended_response,
  } = judgeResponse.structuredResponse

  return {
    judge: {
      solution_1_score,
      solution_2_score,
      reasoning,
      recommendation: recommended_response,
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
