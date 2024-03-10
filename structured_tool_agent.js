import * as dotenv from 'dotenv';
dotenv.config();
import { initializeAgentExecutorWithOptions } from "langchain/agents"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { Calculator } from "langchain/tools/calculator"
import { OpenAI } from "langchain/llms/openai"
import { DynamicStructuredTool } from 'langchain/tools'
import { z } from "zod"

OpenAI.apiKey = process.env.OPENAI_API_KEY

export const run = async () => {
    const model = new ChatOpenAI({ temperature: 0 })
    const tools = [
        new Calculator(),
        new DynamicStructuredTool({
            name: "random-number-generator",
            description: "generates a random number between two input numbers",
            schema: z.object({
                low: z.number().describe("The lower bound of the generated number."),
                high: z.number().describe("The upper bound of the generated number."),
            }),
            func: async ({ low, high }) =>
                (Math.random() * (high - low) + low).toString()
        })
    ]
    const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "structured-chat-zero-shot-react-description",
        verbose: false,
    })
    console.log("Loaded agent.")
    
    const input = `What is a random number between 5 and 10 raised to the second power?`
    
    console.log(`Executing with input "${input}"...`)
    
    const result = await executor.call({ input })
    
    console.log({ result })
}

run().catch((error) => {
    console.error(error)
})