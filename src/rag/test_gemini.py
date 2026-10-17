
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

model = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    temperature=0,
)

response = model.invoke(
    "Explain credit risk in two simple sentences."
)

content = response.content

if isinstance(content, list):
    for block in content:
        if isinstance(block, dict) and block.get("type") == "text":
            print(block["text"])
else:
    print(content)
