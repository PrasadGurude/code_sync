import React, { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap,  lineNumbers } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion } from "@codemirror/autocomplete";
import { ACTIONS } from "../Actions";

const Editor = ({ socketRef, roomId }) => {
    const editorRef = useRef(null);
    const viewRef = useRef(null); // Store editor instance

    useEffect(() => {
        if (!editorRef.current) return;

        const startState = EditorState.create({
            doc: "// Start coding here...",
            extensions: [
                javascript(),
                oneDark,
                lineNumbers(),
                keymap.of(defaultKeymap),
                autocompletion(),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        const newCode = update.state.doc.toString();
                        socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code: newCode });
                    }
                }),
            ],
        });

        const view = new EditorView({
            state: startState,
            parent: editorRef.current,
        });

        viewRef.current = view;

        return () => {
            view.destroy();
        };
    }, [roomId, socketRef]);

    useEffect(() => {
        if (!socketRef.current) return;

        socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
            if (viewRef.current) {
                viewRef.current.dispatch({
                    changes: { from: 0, to: viewRef.current.state.doc.length, insert: code },
                });
            }
        });

        // Sync latest code when joining
        socketRef.current.on(ACTIONS.CODE_SYNC, ({ code }) => {
            if (viewRef.current) {
                viewRef.current.dispatch({
                    changes: { from: 0, to: viewRef.current.state.doc.length, insert: code },
                });
            }
        });

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
            socketRef.current.off(ACTIONS.CODE_SYNC);
        };
    }, [socketRef]);

    return <div ref={editorRef} className="border p-2 rounded-md h-100vh" />;
};

export default Editor;
