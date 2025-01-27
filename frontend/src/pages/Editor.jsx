import React, { useEffect, useRef,useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, lineNumbers } from "@codemirror/view";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion } from "@codemirror/autocomplete"; // Auto-completion

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    let langExtension;
    switch (language) {
      case "python":
        langExtension = python();
        break;
      case "html":
        langExtension = html();
        break;
      case "cpp":
        langExtension = cpp();
        break;
      case "java":
        langExtension = java();
        break;
      default:
        langExtension = javascript();
    }
    const startState = EditorState.create({
      doc: "// Write your JavaScript code here...",
      extensions: [
        javascript(),   // JavaScript syntax highlighting
        oneDark,        // One Dark theme
        lineNumbers(),
        keymap.of(defaultKeymap), // Basic key bindings (e.g., indent, undo),
        autocompletion(),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    return () => {
      view.destroy(); // Cleanup
    };
  }, []);

  return (
    <div>
      <select onChange={(e) => setLanguage(e.target.value)} value={language} className="text-black bg-white rounded-md m-1">
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="html">HTML</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>
      <div ref={editorRef} className="border p-2 rounded-md h-100vh" />
    </div>
  );
};

export default CodeEditor;
