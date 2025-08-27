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

## Additional Features Beyond Google Meet

Collab offers several advanced features that are not available in platforms like Google Meet:

- **Geolocation Tracking**  
  Enables tracking of participants real-time locations during meetings.

- **File Sharing Within Meetings**  
  Allows users to send and receive files directly inside the meeting interface.

- **AI Meeting Assistant**  
  An intelligent assistant capable of summarizing discussions, generating responses, and enhancing productivity.

- **Participant Ban Option**  
  Provides the ability to block or remove users from a meeting session with full control.

- **Customizable Meeting Themes**  
  Supports personalized themes or branded meeting room appearances.

- **AI-Generated Video Avatars**  
  Allows users to represent themselves using animated AI avatars.

- **Real-time Text-to-Speech and Speech-to-Text Conversion**  
  Facilitates accessibility and multi-language communication through voice and text conversion.

- **Voice Command Control**  
  Enables hands-free interaction by allowing meeting controls via voice recognition.

- **Built-in Whiteboard and Collaborative Editor**  
  Includes integrated tools for real-time sketching, note-taking, and code or document editing.

- **Snapshot**  
  Allows users to take screenshots of the meeting screen with easy clicks, eliminating the need for complex keyboard shortcuts.

---

## Premium Features

The following advanced features are available under **Collab Premium**:

- **AI Assistant**  
  A powerful virtual assistant that helps with note-taking, task management, and meeting insights.

- **AI Avatar**  
  An intelligent avatar seamlessly integrated with the AI Assistant, capable of reading text aloud and enhancing the meeting experience.

- **User Ban**  
  Provides premium-level moderation control to remove and permanently ban disruptive participants.

- **Voice Command Control**  
  Unlock advanced voice interactions to seamlessly control meeting functions hands-free.

---
