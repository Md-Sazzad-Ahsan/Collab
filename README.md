# Collab

Collab is a Node.js application that allows users to connect and collaborate in a virtual meeting space. This README will guide you through setting up and running the project locally.

## Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (v14 or later) – [Download Node.js](https://nodejs.org)
- **npm** (Node Package Manager) – Typically installed with Node.js
- **Ollama** – Required for running the Llama model ([Install Ollama](https://ollama.com/download))

## Installation and Running the Application

1. **Clone the repository:**

    ```bash
    git clone https://github.com/AkibHossainOmi/collab.git
    cd collab
    ```

2. **Install dependencies:**

    Run the following command to install the necessary dependencies:

    ```bash
    npm install
    ```

3. **Copy the configuration file:**

    Before starting the application, copy the template configuration file:

    ```bash
    cp app/src/config.template.js app/src/config.js
    ```

4. **Install and run Ollama:**

    Install Ollama if you haven't already, and then run the Llama model:

    ```bash
    ollama run llama3.2:1b
    ```

5. **Start the application:**

    To start the application locally, use the following command:

    ```bash
    npm start
    ```

    This will run the server, and you should be able to access the app at `http://localhost:3010`.
