import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getQuestionAndTestCase, createTestCase, deleteOneTestCase } from "../../services/testcase/testcase";
import notify from "../../services/toast/Toast";

const AddTestCaseComponent = () => {

    const [testcase, setTestCase] = useState({
        loading: true,
        error: "",

        question: {},
        testcases: [],

        input: null,
        output: null
    });

    const { questionId } = useParams();

    useEffect(() => {
        fetchQuestionAbout();
    }, []);

    const fetchQuestionAbout = () => {
        getQuestionAndTestCase(questionId)
            .then(data => {
                if (data.error) {
                    setTestCase({ ...testcase, error: data.error, loading: false })
                } else {
                    setTestCase({ ...testcase, error: "", loading: false, question: data.question, testcases: data.testcases })
                }
            })
            .catch(err => {
                setTestCase({ ...testcase, loading: false, error: "Please Check Your Internet Connectivity" })
            })
    }

    const onLoading = () => {
        return testcase.loading && <p className="text-center text-warning font-weight-bold">Please Wait...</p>
    }

    const errorMessage = () => {
        return testcase.error && <p className="text-center text-danger font-weight-bold">{testcase.error}</p>
    }

    const onSubmit = (event) => {
        event.preventDefault();
        setTestCase({ ...testcase, loading: true, error: "" })
        createTestCase(questionId, testcase)
            .then((data) => {
                if (data.error) {
                    setTestCase({ ...testcase, loading: false, error: data.error })
                } else {
                    setTestCase({ ...testcase, loading: true, error: "", input: null, output: null })
                    fetchQuestionAbout();
                    notify("success", "Test Case Added");
                }
            })
            .catch(err => {
                setTestCase({ ...testcase, loading: false, error: "Please Check Your Internet Connection" })
            })
    }

    const handlechangeFile = name => event => {
        setTestCase({ ...testcase, [name]: event.target.files[0] });
    }

    const deleteTestCase = (testcaseId) => {
        setTestCase({ ...testcase, loading: true, error: "" })
        deleteOneTestCase(questionId, testcaseId)
            .then(data => {
                if (data.error) {
                    setTestCase({ ...testcase, loading: false, error: data.error })
                } else {
                    setTestCase({ ...testcase, loading: true, error: "" })
                }
                fetchQuestionAbout()
                notify("warn", "Test case deleted")
            })
            .catch(err => {

            })
    }

    const TestCaseListComp = () => {
        if (testcase.testcases.length) {
            let i = 1;
            return testcase.testcases.map((testcase) => {
                let inputLink = `/testcase/raw/input/${questionId}/${testcase.id}`;
                let outputLink = `/testcase/raw/output/${questionId}/${testcase.id}`;
                return <li className="list-group-item" key={testcase.id}>
                    <div className="row">

                        <div className="col-md-3"><span className="input-label">Testcase #{i++}</span></div>
                        <div className="col-md-3">
                            <Link target="_blank" to={inputLink}>
                                input
                            </Link>
                        </div>
                        <div className="col-md-3">
                            <Link target="_blank" to={outputLink}>
                                output
                            </Link>
                        </div>
                        <div className="col-md-3">
                            <span className="float-right badge badge-pill badge-danger btn" onClick={() => { deleteTestCase(testcase.id) }}>
                                delete
                            </span>
                        </div>
                    </div>
                </li>
            })
        } else {
            return <h6 className="text-center">No TestCases found !!!</h6>
        }
    }

    return (
        <div className="container min-height-fix-footer">
            <h1 className="text-center mt-4">Add Some Killer TestCases</h1>
            {onLoading()}
            {errorMessage()}
            <h4 className="text-center">{testcase.question.name}</h4>
            <div className="row mx-0 my-4 pb-md-0 pb-sm-4 shadow-sm align-items-center">
                <div className="col-md-4">
                    <div className="form-group">
                        <span className="input-label">Input File</span>
                        <div className="input-group">
                            <input type="file" className="form-control-file" onChange={handlechangeFile("input")}></input>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <span className="input-label">Output File</span>
                        <div className="input-group">
                            <input type="file" className="form-control-file" onChange={handlechangeFile("output")}></input>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <button className="btn btn-primary float-right" onClick={onSubmit}>Add</button>
                </div>
            </div>
            <div className="card mb-5">
                <div className="card-body">
                    <ul className="list-group list-group-flush row">
                        {TestCaseListComp()}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default AddTestCaseComponent;