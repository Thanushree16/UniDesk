import { useEffect } from "react";
import { LeftPanel } from "../components/LeftPanel";
import { BiArrowBack, BiSend } from "react-icons/bi";

import "./AiPage.css";

export function AiPage() {
  useEffect(() => {
    document.title = "AI Assistant | UniDesk";
  }, []);

  return (
    <div className="dashboard-layout">
      <LeftPanel />

      <main className="ai-main">
        {/* Header */}
        <div className="ai-header">
          <BiArrowBack className="back-icon" />
          <h3>List of questions of Unit -1 BDA from the question bank</h3>
          <div className="ai-header-icons">
            <div className="bell-dot"></div>
            <div className="profile-circle"></div>
          </div>
        </div>

        {/* Chat Body */}
        <div className="ai-chat">
          {/* User message */}
          <div className="chat-bubble user">
            Can you help me list questions in Unit - 1 from the question bank
          </div>

          {/* AI response */}
          <div className="chat-bubble ai">
            <div className="ai-name">Unify AI</div>
            <p>
              Of course! Here are the questions from Unit 1 of your Big Data
              Analytics question bank.
            </p>

            <strong>Short Answer Questions:</strong>
            <ul>
              <li>List various applications of big data.</li>
              <li>What do the four V’s of Big Data denote?</li>
              <li>Differentiate between structured and unstructured data.</li>
              <li>What are the most commonly defined input formats in Hadoop?</li>
              <li>What all modes Hadoop can be run in?</li>
              <li>What are the types of digital data?</li>
              <li>
                Write a command to print the lines that has the pattern “july” in
                all the files in a particular directory.
              </li>
              <li>What is GREP command? Explain with 3 examples.</li>
            </ul>
          </div>
        </div>

        {/* Input Box */}
        <div className="ai-input">
          <span className="plus">+</span>
          <input type="text" placeholder="Ask Unify AI your queries" />
          <BiSend className="send-icon" />
        </div>
      </main>
    </div>
  );
}
