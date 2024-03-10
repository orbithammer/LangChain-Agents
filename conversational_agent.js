import * as dotenv from 'dotenv';
dotenv.config();
import { initializeAgentExecutorWithOptions } from "langchain/agents"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { SerpAPI } from "langchain/tools"
import { Calculator } from "langchain/tools/calculator"
import { OpenAI } from "langchain/llms/openai"

OpenAI.apiKey = process.env.OPENAI_API_KEY
SerpAPI.apiKey = process.env.SERPAPI_API_KEY

export const run = async () => {
    const model = new ChatOpenAI({ temperature: 0 })
    const tools = [
        new SerpAPI(),
        new Calculator(),
    ]

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "chat-conversational-react-description",
        verbose: true,
    })
    console.log("Loaded agent.")

    const input0 = "Hi, I am Brock."

    const result0 = await executor.call({ input: input0 })

    console.log(`Got output0 ${result0.output}`)

    const input1 = "What's my name?"

    const result1 = await executor.call({ input: input1 })

    console.log(`Got output1 ${result1.output}`)

    const input2 = "What's the weather in Summerland, British Columbia?"

    const result2 = await executor.call({ input: input2})

    console.log(`Got output2 ${result2.output}`)
}

run().catch((error) => {
    console.error(error)
})