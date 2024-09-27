from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from openai import OpenAI
from mappings import emotions, services
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
import markdown
from bs4 import BeautifulSoup
from fastapi.responses import HTMLResponse

load_dotenv()


app = FastAPI(
    title="uea-chatbot",
    docs_url="/",
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai_api_key = os.environ['OPENAI_API_KEY']
openai_model = os.environ['OPENAI_MODEL']
pinecone_api_key = os.environ["PINECONE_API_KEY"]
embeddings_model = os.environ['EMBEDDINGS_MODEL']
index = os.environ['INDEX']




client = OpenAI(api_key=openai_api_key)
pc = Pinecone(api_key=pinecone_api_key)

docsearch = PineconeVectorStore.from_existing_index(index, embeddings_model)
embeddings_model = OpenAIEmbeddings(openai_api_key=openai_api_key, model=embeddings_model)

class ChatRequest(BaseModel):
    query: str



def html_converter_and_parser(content):
    html_answer = markdown.markdown(content)
    print(html_answer)
    soup = BeautifulSoup(html_answer, 'html.parser')
    for p in soup.find_all('p'):
        p.insert_after(soup.new_tag('br'))
    for a in soup.find_all('a'):
        a['target'] = '_blank'
        a['rel'] = 'noopener noreferrer'
    modified_html = str(soup)
    print(modified_html)
    return HTMLResponse(content=modified_html)



def conversational_chat(query):
        
    docsearch = PineconeVectorStore.from_existing_index(index, embeddings_model)

    results = docsearch.similarity_search(
        query,
        k=5,
    )

    context = ""
    for res in results:
        context += res.page_content

    system_prompt = f"""

        You are a virtual assistant designed to support students at the University of East Anglia (UEA) in Norwich. Your role is to provide helpful information and guidance on various topics related to student life, including:

        Academic support and resources
        Mental health and wellbeing services
        Disability support and accommodations
        Career advice and employability resources
        Visa and immigration guidance for international students
        General inquiries about campus facilities and events
        
        When responding to students, ensure your tone is friendly, supportive, and informative. Always encourage students to reach out for further assistance if needed.

        A context window is given to you according to the question of the user, you have to answer from the context according to the user's question. If the user's question doesn't match with context, answer according to your intelligence.
        User's Question: {query}
        Context: {context}

        Here are some example questions you might receive:

        What resources are available for academic support at UEA?
        How can I access mental health services?
        What should I do if I need disability accommodations?
        Can you provide information about career services and job opportunities?
        What are the steps for international students regarding visa applications?
        Be prepared to provide concise answers, direct students to relevant resources, and offer encouragement.
        

        """
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": query}
    ] 

    response = client.chat.completions.create(
        model = openai_model,
        messages = messages,
    )

    answer = response.choices[0].message.content
    result = html_converter_and_parser(answer)
    return result



@app.post('/query')
def user_query(request: ChatRequest):
    query = request.query
    try:
        answer = conversational_chat(query)
        return answer
    except Exception as e:
        return str(e)