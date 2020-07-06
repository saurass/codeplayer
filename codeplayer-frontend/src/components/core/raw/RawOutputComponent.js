import React, { useState, useEffect } from "react";
import { getRawOutput } from "../../../services/raw/raw";
import { useParams } from "react-router-dom";

const RawOutputComponent = () => {
    const [output, setOutput] = useState({
        loading: true,
        error: "",

        rawOutput: ""
    });

    const { questionId, testcaseId } = useParams();

    useEffect(() => {
        getRawOutput(questionId, testcaseId)
            .then(data => {
                if (data.error) {
                    setOutput({ ...output, loading: false, error: data.error })
                } else {
                    setOutput({ ...output, rawOutput: data.output, loading: false, error: "" })
                }
            })
            .catch(err => {
                setOutput({ ...output, loading: false, error: "Internet Connection error" })
            })
    }, [])

    const onLoading = () => {
        return output.loading && <p className="text-center text-warning font-weight-bold">Please Wait...</p>
    }

    const errorMessage = () => {
        return output.error && <p className="text-center text-danger font-weight-bold">{output.error}</p>
    }

    return (
        <div className="container my-5 min-height-fix-footer">
            {onLoading()}
            {errorMessage()}
            <div className="border px-3 py-3">
                <pre>{output.rawOutput}</pre>
            </div>
        </div>
    )
}

export default RawOutputComponent;