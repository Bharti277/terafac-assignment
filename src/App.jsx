import { useState } from "react";
import { marked } from "marked";
import "./App.css";

export default function App() {
  const [endpoint, setEndpoint] = useState("");
  const [response, setResponse] = useState("");
  const [displayMode, setDisplayMode] = useState("Plain Text");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchApi = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      const jsonString = JSON.stringify(data, null, 2);
      setResponse(jsonString);
      setError(null);
    } catch (err) {
      setResponse("");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponseChange = (e) => {
    setResponse(e.target.value);
  };

  const renderMarkdown = () => {
    try {
      const jsonMarkdown = response
        .replace(/"([^"]+)":/g, "**$1**:")
        .replace(/(:\s*"[^"]*")/g, "`$1`")
        .replace(/(:\s*\d+)/g, "`$1`");
      return marked(jsonMarkdown);
    } catch {
      return "<p>Invalid JSON format for Markdown rendering.</p>";
    }
  };

  return (
    <div className="container">
      <div className="api_fetcher_tool_container">
        <h2 className="api_fetcher_tool_heading">API Fetcher Tool</h2>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="Enter API endpoint"
          className="api_input"
        />
        <button onClick={fetchApi} disabled={isLoading} className="api_btn">
          {isLoading ? "Loading..." : "Fetch API"}
        </button>
      </div>

      {/* Error message */}
      <div className="error_message">
        {error && <div className="error_display">{error}</div>}
      </div>
      {/* Side Panels */}

      <div className="panels">
        <div className="api_response">
          <h4 className="api_res_heading">API Response (JSON Section)</h4>

          <textarea
            value={response}
            onChange={handleResponseChange}
            placeholder="Editable API response will appear here..."
            className="api_res_textarea"
          />
        </div>

        <div className="html_markdown_res">
          <div className="dropdown">
            <label htmlFor="displayMode" className="label">
              JSON Format:
            </label>
            <select
              className="select_dropdown"
              id="displayMode"
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value)}
            >
              <option value="Plain Text">HTML</option>
              <option value="Markdown">Markdown</option>
            </select>
          </div>
          <div className="html_markdown_response">
            {displayMode === "Plain Text" ? (
              <div>{response}</div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown() }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
