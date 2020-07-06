import React, { useState, useEffect } from "react";
import { getRawInput } from "../../../services/raw/raw";
import { useParams } from "react-router-dom";

const RawInputComponent = () => {
    const [input, setInput] = useState({
        loading: true,
        error: "",

        rawInput: ""
    });

    const { questionId, testcaseId } = useParams();

    useEffect(() => {
        getRawInput(questionId, testcaseId)
            .then(data => {
                if (data.error) {
                    setInput({ ...input, loading: false, error: data.error })
                } else {
                    setInput({ ...input, rawInput: data.input, loading: false, error: "" })
                }
            })
            .catch(err => {
                setInput({ ...input, loading: false, error: "Internet Connection error" })
            })
    }, [])

    const onLoading = () => {
        return input.loading && <p className="text-center text-warning font-weight-bold">Please Wait...</p>
    }

    const errorMessage = () => {
        return input.error && <p className="text-center text-danger font-weight-bold">{input.error}</p>
    }

    return (
        <div className="container my-5 min-height-fix-footer">
            {onLoading()}
            {errorMessage()}
            <div className="border px-3 py-3">
                <pre>{input.rawInput}</pre>
            </div>
        </div>
    )
}

export default RawInputComponent;