
# Scribe — AI Developer Journal

> An AI-powered developer journal that turns your development notes into structured insights and lets you interact with your own knowledge using Retrieval-Augmented Generation (RAG).

Scribe is a full-stack journaling application built for developers who want to record their learning, debugging experiences, project progress, and technical thoughts — and later retrieve and interact with that information using natural language.

Instead of treating journal entries as simple text, Scribe uses **LLM-powered summarization and semantic search** to make your development history searchable and conversational.

---

## ✨ Features

* 📝 **Developer Journaling**
  Create and manage personal development journal entries.

* 🤖 **AI-Powered Summarization**
  Automatically generate concise summaries from journal entries using an LLM.

* 🔎 **Semantic Search**
  Find relevant journal entries based on meaning rather than exact keyword matches.

* 💬 **AI Chat with Your Journal**
  Ask questions about your previous work, learnings, bugs, or projects using natural language.

* 🧠 **RAG Pipeline**
  Uses embeddings and vector similarity search to retrieve relevant entries before generating an answer.

* 🔐 **Authentication**
  Secure user authentication with protected API routes.

* 📊 **Personal Knowledge Base**
  Your journal gradually becomes a searchable technical knowledge base.

---

## 🏗️ How It Works

Scribe uses a Retrieval-Augmented Generation pipeline instead of sending an entire journal history to the LLM.

### Journal Entry Flow

```text
User creates journal entry
          │
          ▼
       Backend
          │
          ▼
   Generate summary
          │
          ▼
 Generate embedding
          │
          ▼
 MongoDB + Vector Search
```

### AI Chat Flow

```text
User asks a question
          │
          ▼
   Generate query embedding
          │
          ▼
 MongoDB Atlas Vector Search
          │
          ▼
 Retrieve relevant journal entries
          │
          ▼
   Build context for LLM
          │
          ▼
     Groq LLM API
          │
          ▼
      AI response
```

The key idea is that the LLM does **not** need to receive the user's entire journal history. Scribe first retrieves the entries that are semantically relevant to the question and uses those entries as context.

---

## 🧠 RAG Architecture

Scribe's RAG pipeline consists of four major stages:

### 1. Indexing

When a journal entry is created, its content is converted into an embedding using **Cohere Embeddings**.

```text
Journal Entry
     ↓
Cohere Embedding Model
     ↓
Vector Representation
     ↓
MongoDB Atlas
```

### 2. Retrieval

When a user asks a question, the question is also converted into an embedding.

MongoDB Atlas Vector Search then finds journal entries whose embeddings are most similar to the query.

```text
User Question
     ↓
Query Embedding
     ↓
Vector Similarity Search
     ↓
Relevant Journal Entries
```

### 3. Context Construction

The retrieved entries are combined into a context that is provided to the LLM along with the user's question.

### 4. Generation

The **Groq LLM API** generates the final response using the retrieved journal entries as context.

```text
Question + Retrieved Context
              ↓
          Groq LLM
              ↓
         Final Answer
```

This approach keeps the model grounded in the user's own data and avoids unnecessarily sending unrelated journal entries to the model.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* CSS / Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### AI / Machine Learning

* Groq API — LLM inference
* Cohere — text embeddings
* MongoDB Atlas Vector Search — semantic retrieval
* Retrieval-Augmented Generation (RAG)

### Deployment

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas

---

## 📂 Project Structure

```text
Scribe/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── .gitignore
└── README.md
```

> The exact structure may differ depending on the current repository implementation.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js 18+
* npm
* MongoDB Atlas account
* Groq API key
* Cohere API key

### 1. Clone the repository

```bash
git clone https://github.com/divyank0203/scribe.git
cd scribe
```

### 2. Install dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

GROQ_API_KEY=your_groq_api_key

COHERE_API_KEY=your_cohere_api_key

JWT_SECRET=your_jwt_secret
```

Do not commit your `.env` file to the repository.

### 4. Start the backend

```bash
cd server
npm run dev
```

### 5. Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

The application should now be available at:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

| Variable         | Description                            |
| ---------------- | -------------------------------------- |
| `MONGO_URI`      | MongoDB Atlas connection string        |
| `GROQ_API_KEY`   | API key used for LLM inference         |
| `COHERE_API_KEY` | API key used for generating embeddings |
| `JWT_SECRET`     | Secret used for authentication tokens  |
| `PORT`           | Backend server port                    |

---

## 🔄 Data Flow

```text
                    ┌──────────────────┐
                    │      React       │
                    │    Frontend      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     Express      │
                    │      API         │
                    └───────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
        ┌──────────┐  ┌───────────┐  ┌──────────┐
        │ MongoDB  │  │  Cohere   │  │  Groq    │
        │  Atlas   │  │ Embeddings│  │   LLM    │
        └────┬─────┘  └───────────┘  └────┬─────┘
             │                             │
             └──────── Vector Search ──────┘
```

---

## 💡 Why RAG?

A straightforward implementation could send a user's recent journal entries directly to an LLM whenever they ask a question.

That approach becomes inefficient as the amount of journal data grows.

Scribe instead uses semantic retrieval:

```text
Large Journal
     │
     ▼
Vector Search
     │
     ▼
Relevant Entries
     │
     ▼
LLM Context
     │
     ▼
Answer
```

This reduces irrelevant context and allows the application to work with a growing knowledge base without repeatedly sending the entire journal history to the model.

---

## 🎯 Example Queries

Once journal entries have been added, users can ask questions such as:

```text
"What problems did I face while deploying my projects?"

"Explain what I learned about authentication."

"What were the main bugs I encountered in my React projects?"

"Summarize my progress on backend development."

"Which concepts have I struggled with repeatedly?"
```

The system retrieves relevant entries and uses them as context for the generated response.

---

## 🌐 Deployment

The application is designed as a separate frontend/backend deployment:

```text
React Frontend
     │
     ▼
   Vercel
     │
     ▼
Express Backend
     │
     ├── MongoDB Atlas
     ├── Cohere API
     └── Groq API
```

---

## 🔮 Future Improvements

* [ ] Streaming AI responses
* [ ] Better conversation history
* [ ] Advanced filtering and hybrid search
* [ ] Journal tags and categories
* [ ] Analytics for learning progress
* [ ] Export journal data
* [ ] Improved citation/source references in RAG responses
* [ ] Automated evaluation of RAG responses
* [ ] Background embedding generation

---

## 📚 Key Concepts Demonstrated

This project was built to explore practical applications of:

* Retrieval-Augmented Generation (RAG)
* Vector embeddings
* Semantic search
* Vector databases
* LLM application architecture
* REST APIs
* Authentication
* MongoDB
* Full-stack development
* Cloud deployment

---

