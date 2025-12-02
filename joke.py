from langchain_ollama import OllamaLLM

llm = OllamaLLM(
  model='qwen2.5:1.5b-instruct-q8_0'
)

print(llm.invoke('tell me a joke?'))
