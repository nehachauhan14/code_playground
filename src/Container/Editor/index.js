import React, { useState, useEffect } from "react";
import MonacoEditor from "react-monaco-editor";
import styles from "./styles.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { setEditor, setInstances, setEditorContent } from "./action";

const Editor = () => {
  const reducerData = useSelector((state) => state.editorReducer);
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(0);
  const { editor, instances, defaultFn } = reducerData;
  const [isEdited, setIsEdited] = useState(false);
  const editorOptions = {
    value: defaultFn,
    language: "javascript",
    minimap: {
      enabled: false,
    },
    theme: "vs-dark",
    scrollbar: {
      useShadows: false,
      verticalScrollbarSize: 0,
      horizontalScrollbarSize: 0,
      verticalHasArrows: true,
      horizontalHasArrows: true,
      vertical: "hidden",
      horizontal: "hidden",
    },
  };

  useEffect(() => {
    createEditor();
  }, []);

  useEffect(() => {
    instances.length && switchTab();
  }, [instances]);

  const createEditor = () => {
    // autocompletion
    monaco.languages.registerCompletionItemProvider("javascript", {
      triggerCharacters: ["."],
      provideCompletionItems: (model, position, context, token) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });
        if (
          /(([\s|\n]+from\s+)|(\brequire\b\s*\())["|'][^'^"]*$/.test(
            textUntilPosition
          )
        ) {
          if (
            textUntilPosition.endsWith(".") ||
            textUntilPosition.endsWith("/")
          ) {
            return Object.keys(this.props.files)
              .filter((path) => path !== this.props.path)
              .map((path) => {
                let file = getRelativePath(this.props.path, path);
                if (file.startsWith(prefix)) {
                  file = file.slice(typed.length);
                  return {
                    label: file,
                    insertText: file.replace(/\.js$/, ""),
                    kind: monaco.languages.CompletionItemKind.File,
                  };
                }
                return null;
              })
              .filter(Boolean);
          } else {
            return Object.keys(this.props.dependencies).map((name) => ({
              label: name,
              detail: this.props.dependencies[name],
              kind: monaco.languages.CompletionItemKind.Module,
            }));
          }
        }
      },
    });

    //editor creation
    const editor = monaco.editor.create(
      document.getElementById("container"),
      editorOptions
    );
    dispatch(setEditor(editor));
    addNewTab("main", editor);

    // modal content onchange event
    editor.onDidChangeModelContent((e) => {
      editor._modelData.model.uri == "main.js" && setIsEdited(true);
    });
  };

  // Create a new model/tab of editor
  const addNewTab = (fileName, editorInstance) => {
    fileName = !fileName ? Math.random().toString(36).substring(7) : fileName;
    const instance = monaco.editor.createModel(
      editorInstance
        ? defaultFn
        : `function hello() {\n\talert('Hello world ${fileName}!');\n}`,
      "javascript",
      `${fileName}.js`
    );
    monaco.editor.setModelLanguage(instance, "javascript");
    dispatch(setInstances([...instances, instance]));
    editorInstance
      ? editorInstance.setModel(instance)
      : editor.setModel(instance);
    setCurrentTab(instance.id);
  };

  // To swich among tabs
  const switchTab = (tabname) => {
    const instance = tabname
      ? [...instances].find((x) => x._associatedResource == tabname)
      : instances[instances.length - 1];
    editor.setModel(instance);
    setCurrentTab(instance.id);
  };

  // To delete existing tabs
  const deleteTab = (e, instance) => {
    e && e.stopPropagation();
    const updatedInstances = [...instances].filter(
      (x) => x._associatedResource != instance.uri
    );
    dispatch(setInstances(updatedInstances));
    const model = monaco.editor
      .getModels()
      .find((model) => model.uri === instance.uri);
    model && model.dispose();
  };

  // apply changes for Main.js
  const applyChanges = () => {
    try {
      const fn = new Function(`return ${editor.getValue()}`)();
      if (fn) {
        dispatch(setEditorContent(editor.getValue()));
        setIsEdited(false);
      }
    } catch (err) {
      alert(`Please resolve the issues first!: ${err.message}`);
    }
  };

  // Editor header JSX
  const header = () => (
    <div className={`flex alignCenter jcSpaceBetween ${styles.editorHeader}`}>
      <div className={`flex alignFlexEnd ${styles.left}`}>
        {instances.map((ins, idx) => (
          <div
            className={`${styles.tile} ${ins.id == currentTab ? styles.active : ""}`}
            key={idx}
            onClick={() => switchTab(ins._associatedResource)}
          >
            <span>{ins._associatedResource}</span>
            {ins.uri !== "main.js" && (
              <span onClick={(e) => deleteTab(e, ins)} className={styles.crossIcon}>
                x
              </span>
            )}
          </div>
        ))}
        <div className={styles.addIcon} onClick={() => addNewTab()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 8 8"
          >
            <path
              fill="#C6C6C6"
              fill-rule="nonzero"
              d="M7.059 3.048H4.952V.94a.954.954 0 0 0-1.904 0v2.107H.94a.954.954 0 0 0 0 1.904h2.107V7.06a.954.954 0 0 0 1.904 0V4.952H7.06a.954.954 0 0 0 0-1.904z"
            />
          </svg>
        </div>
      </div>
      <div className={`flex alignCenter jcCenter ${styles.right}`}>
        <div
          className={`${styles.applyBtn} ${isEdited ? styles.activeBtn : ""}`}
          onClick={() => isEdited && applyChanges()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="12"
            viewBox="0 0 11 12"
          >
            <g fill={isEdited ? "#FFF" : "#454545"} fill-rule="evenodd">
              <path d="M.846 5.923a4.654 4.654 0 0 1 8.087-3.141l-1.874.625a.424.424 0 1 0 .267.803l2.538-.846a.423.423 0 0 0 .29-.402V.423a.423.423 0 1 0-.846 0V1.97A5.49 5.49 0 0 0 0 5.923a.423.423 0 1 0 .846 0M10.577 5.5a.423.423 0 0 0-.423.423 4.654 4.654 0 0 1-8.087 3.141l1.874-.624a.424.424 0 1 0-.267-.804l-2.538.846a.423.423 0 0 0-.29.403v2.538a.423.423 0 1 0 .846 0V9.878A5.49 5.49 0 0 0 11 5.923a.423.423 0 0 0-.423-.423" />
            </g>
          </svg>
          <span>Apply Changes</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="editorContainer">
      {header()}
      <div
        id="container"
        data-lang="text/javascript"
        style={{ height: "100%" }}
      ></div>
    </div>
  );
};

export default Editor;
