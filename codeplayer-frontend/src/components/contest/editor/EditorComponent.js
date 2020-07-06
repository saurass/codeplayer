import React, { useState, useEffect, useContext } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";

import "./EditorComponent.css"
import { useParams } from "react-router-dom";
import { getQuestionStatement } from "../../../services/question/question";
import { createSubmission } from "../../../services/submission/submission";
import {GlobalContext} from "../../../context/GlobalContext";
import notify from "../../../services/toast/Toast";
import MathJax from "react-mathjax";

function EditorComponent() {
    const [question, setQuestion] = useState({
        
        loading: true,
        error: "",
        evaluating: false,

        question: "",
        name: "",

        language: "",
        code: "",

        editorMode: "c_cpp",
        fontSize: 18,

    });

    const [globals, setGlobals] = useContext(GlobalContext)
    
    useEffect(() => {
        fetchQuestionStatement();
        setGlobals({...globals, verdict: null});
    }, [])

    const { questionId } = useParams();

    const fetchQuestionStatement = () => {
        getQuestionStatement(questionId)
            .then(data => {
                if (data.error) {
                    setQuestion({ ...question, loading: false, error: data.error })
                } else {
                    setQuestion({ ...question, loading: false, question: data.question, name: data.name, error: "" })
                }
            })
            .catch(err => {
                setQuestion({ ...question, loading: false, error: "Please Check Your Internet Connection" })
            })
    }

    const onLoading = () => {
        return question.loading && <p className="text-center text-warning font-weight-bold">Please Wait...</p>
    }

    const errorMessage = () => {
        return question.error && <p className="text-center text-danger font-weight-bold">{question.error}</p>
    }

    const handleMode = (event) => {
        let lang = event.target.value;
        let req_mode = "c_cpp";
        if (lang == 'c++') {
            req_mode = "c_cpp"
        } else if (lang == 'java') {
            req_mode = "java"
        } else if (lang == 'python') {
            req_mode = "python"
        } else if (lang == 'js') {
            req_mode = "js"
        }

        setQuestion({ ...question, editorMode: req_mode, language: lang })
    }

    const submitCode = (event) => {
        event.preventDefault();
        setQuestion({ ...question, error: "", evaluating: true })
        setGlobals({...globals, verdict: null})
        createSubmission(questionId, question)
            .then(data => {
                if (data.error) {
                    setQuestion({ ...question, error: data.error, evaluating: false })
                }
            })
            .catch(err => {
                setQuestion({ ...question, evaluating: false, error: "Please Check Your Internet Connection" })
            })
    }

    const showSubmissionError = (errCode, msg) => {
        let retval = msg;
        if(errCode == "CE") {
            retval = "Compilation Error";
        }
        return <span className="text-danger ml-auto">{retval}</span>
    }

    const showSubmissionSuccess = (succCode, msg) => {
        let retval = msg;
        return <span className="text-success ml-auto">{retval}</span>
    }

    const isEvaluating = () => {
        if(question.evaluating) {
            if(globals.verdict == null) {
                return <React.Fragment>
                    <div class="clearfix ml-auto">
                        <div class="spinner-border float-right text-info" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <span className="text-info ml-2">Evaluating...</span>
                </React.Fragment>
            }
            else if(globals.verdict.error) {
                setQuestion({...question, evaluating: false})
                let error = globals.verdict.error;
                if(error == "CE")
                    notify("danger", "Compilation Error");
                else
                    notify("danger", globals.verdict.message);
                return showSubmissionError(error, globals.verdict.message)
            } else {
                let succ = globals.verdict.success;
                if(succ == "AC") {
                    setQuestion({...question, evaluating: false})
                    notify("success", "Accepted Solution")
                }
                return showSubmissionSuccess(succ, globals.verdict.message)
            }
        }
        else if(globals.verdict != null && question.evaluating == false) {
            if(globals.verdict.error) {
                let error = globals.verdict.error;
                return showSubmissionError(error, globals.verdict.message)
            } else {
                let succ = globals.verdict.success;
                return showSubmissionSuccess(succ, globals.verdict.message)
            }
        }
    }

    const handleCodeChange = (ncode) => {
        setQuestion({ ...question, code: ncode })
    }

    const texb = "<b>Hello</b>";

    return (
        <div class="container-fluid min-height-fix-footer">
            <div class="row">
                <div class="col-md-6">
                    <div className="d-flex align-items-center">
                        <span className="questionname">{question.name}</span>
                        {isEvaluating()}
                    </div>
                    <div class="text-justify">
                        {onLoading()}
                        {errorMessage()}
                        {/* <MathJax.Provider>
                            {question.question}
                        </MathJax.Provider> */}
                        <div className="content" dangerouslySetInnerHTML={{__html: question.question}}></div>
                    </div>

                </div>

                <div class="col-md-6 px-0 mx-0 min-height-editor-mobile">
                    <AceEditor
                        mode={question.editorMode}
                        theme="monokai"
                        name="editor"
                        fontSize={question.fontSize}
                        editorProps={{ $blockScrolling: true }}
                        onChange={handleCodeChange}
                        value={question.code}
                    />
                    <div class="container bg-dark">
                        <div class="row py-2">
                            <div class="col-md-12">
                                <div class="btn-group">
                                    <div class="form-group">
                                        <select className="custom-select" onChange={handleMode}>
                                            <option value="" selected>Select Lang</option>
                                            <option value="c++">C++</option>
                                            <option value="python">Python</option>
                                        </select>
                                    </div>
                                </div>
                                <button class="btn btn-success float-right" onClick={submitCode} disabled={question.loading || question.evaluating}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default EditorComponent;