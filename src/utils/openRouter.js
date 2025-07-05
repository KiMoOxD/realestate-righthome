// utils/openRouter.js

/**
 * Extracts search parameters, validates them, and provides a language-aware conversational response.
 * @param {Array<object>} conversationHistory - The entire chat history for context.
 * @returns {Promise<object>} A promise that resolves to an object like { action: "...", parameters: {...}, response: "..." | null }.
 */
export const extractSearchParameters = async (conversationHistory) => {
  const historyString = conversationHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

  const systemPrompt = `
You are a smart, bilingual real estate assistant, fluent in both English and Arabic. Your goal is to help users find properties by either extracting valid criteria or providing helpful suggestions.

**CRITICAL LANGUAGE RULE:** You MUST detect the language of the last user message and generate your \`response\` text in that **SAME LANGUAGE**.

**CRITICAL REGION RULE:** The 'region' parameter MUST be an array of strings, and each string **MUST BE one of the following exact English names**: ["October", "Zayed", "The Fifth Settlement", "Mostakbal City", "New Capital", "Galala City", "Sokhna", "New Alamein", "North Coast", "Gouna"].

Your response MUST be a single, valid JSON object with three keys: "action", "parameters", and "response".

1.  **action**: Determine the user's primary intent.
    - If the user provides valid search criteria, set to "searching".
    - If the user is unsure, asks for suggestions, or provides an invalid region, set to "suggesting".

2.  **parameters**: An object with extracted criteria. "region", "category", and "status" MUST be arrays of strings. Only include valid parameters.

3.  **response**: The text the chatbot will say, written in the user's language.
    - If action is "searching" but info is missing, ask a follow-up question in the user's language.
    - If action is "searching" and you have enough info, set this to \`null\`.
    - If action is "suggesting", provide a helpful suggestion in the user's language.

---
**Example 1 (Suggestion in Arabic):**
Conversation History:
user: اقترح عليا مناطق

Your JSON Response:
{
  "action": "suggesting",
  "parameters": {},
  "response": "بالتأكيد! لدينا عقارات رائعة في المناطق الساحلية مثل الساحل الشمالي والعين السخنة، وخيارات ممتازة داخل المدينة في أكتوبر وزايد. ما هو نوع الجو الذي تبحث عنه؟"
}
---
**Example 2 (Follow-up Question in English):**
Conversation History:
user: show me villas in gouna

Your JSON Response:
{
  "action": "searching",
  "parameters": { "category": ["villa"], "region": ["Gouna"] },
  "response": "Gouna is a fantastic choice! Are you looking for a villa for sale or for rent?"
}
---
**Example 3 (Invalid Region in Arabic):**
Conversation History:
user: عايز فيلا في القاهرة

Your JSON Response:
{
  "action": "suggesting",
  "parameters": { "category": ["villa"] },
  "response": "يمكنني المساعدة بالتأكيد! على الرغم من عدم وجود قوائم خاصة بـ 'القاهرة'، إلا أن مناطق راقية مثل زايد والتجمع الخامس هي خيارات شائعة وقريبة. هل تهتم بأي منها؟"
}
---

Here is the current conversation. Generate the JSON response based on the last user message, ensuring your response text matches the user's language.

**Conversation History:**
${historyString}

**JSON Response:**
`;

  const messages = [{ role: "user", content: systemPrompt }];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer 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`, // Your key here
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-3n-e4b-it:free",
        messages: messages,
      }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}, body: await response.text()`);

    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log("AI Raw Response:", content);

    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      return { action: "suggesting", parameters: {}, response: "I'm sorry, I had trouble understanding that. Could you please rephrase?" };
    }

    const cleanedString = content.substring(firstBrace, lastBrace + 1);
    console.log("Cleaned JSON String:", cleanedString);
    return JSON.parse(cleanedString);

  } catch (error) {
    console.error("Error extracting parameters from OpenRouter:", error);
    return { action: "suggesting", parameters: {}, response: "I'm sorry, I'm having a technical issue. Please try again." };
  }
};