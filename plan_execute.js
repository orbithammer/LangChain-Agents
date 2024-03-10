import * as dotenv from 'dotenv';
dotenv.config();
import { ChatOpenAI } from "langchain/chat_models/openai"
import { Calculator } from "langchain/tools/calculator"
import { OpenAI } from "langchain/llms/openai"
import { SerpAPI } from 'langchain/tools'
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute"

OpenAI.apiKey = process.env.OPENAI_API_KEY
SerpAPI.apiKey = process.env.SERPAPI_API_KEY

const tools = [new Calculator(), new SerpAPI()]
const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    verbose: false,
})
const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
    llm: model,
    tools,
})

const result = await executor.call({
    input: `Who is the current president of the united states? What is their current age raised to the second power?`,
})
console.log({ result })