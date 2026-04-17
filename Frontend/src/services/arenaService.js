/**
 * Arena Service
 * Handles all API communication with the backend.
 */

const BASE_URL = 'http://localhost:3000'

/**
 * Sends a user prompt to the backend and returns the battle result.
 * @param {string} prompt - The user's question/prompt
 * @returns {Promise<Object>} - The graph result containing problem, solution_1, solution_2, and judge
 */
export async function sendPrompt(prompt) {
  const response = await fetch(`${BASE_URL}/api/v1/chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ problem: prompt }),
  })

  console.log(`Response : ${response}`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Server error: ${response.status}`)
  }

  const data = await response.json()

  console.log(`Data : $${data}`)

  if (!data.success) {
    throw new Error(data.message || 'Battle failed. Please try again.')
  }

  if (!data.graph_result) {
    throw new Error('Server response missing graph_result data.')
  }

  return data.graph_result
}
