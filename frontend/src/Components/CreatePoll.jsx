import React, { useState } from "react";
import OptionAdder from "./OptionAdder";
import "../style/CreatePoll.css";
import { useApp } from "../ContextProvider/AppContext";

const CreatePoll = () => {
  const [type, setType] = useState("");
  const [question, setQuestion] = useState("");
  const [quesOptions, setQuesOptions] = useState([""]);

  const { createPoll, fetchFeed, loading, error, setError } = useApp();

  const handleChoiceClick = (t) => {
    setType(t);
    setQuesOptions([""]);
  };

  const handleCreate = async () => {
    setError?.("");

    if (!type) return;
    if (!question.trim()) return;

    // Build payload expected by backend
    let payload = { type, question: question.trim() };

    if (type === "SingleChoice" || type === "ImageBased") {
      const options = quesOptions.map((o) => String(o || "").trim()).filter(Boolean);
      if (options.length < 2) {
        setError?.("At least 2 options are required");
        return;
      }
      payload.options = options; // backend should map these to schema
    }

    try {
      await createPoll(payload);   // ✅ POST /polls
      await fetchFeed();           // ✅ reload from DB
      setType("");
      setQuestion("");
      setQuesOptions([""]);
    } catch (e) {
      // error already set by context, but you can log
      console.error(e);
    }
  };

  return (
    <div className="createPoll">
      <h2 className="createPoll__title">Create Poll</h2>

      <div className="createPoll__section">
        <h4 className="createPoll__label">Question</h4>
        <textarea
          className="createPoll__textarea"
          value={question}
          id="question"
          placeholder="Enter Your Question....."
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <div className="createPoll__section">
        <h4 className="createPoll__label">Poll Type</h4>

        <div className="createPoll__typeRow">
          <button type="button" onClick={() => handleChoiceClick("YesNo")}
            className={`createPoll__typeBtn ${type === "YesNo" ? "isActive" : ""}`}>
            Yes/No
          </button>

          <button type="button" onClick={() => handleChoiceClick("SingleChoice")}
            className={`createPoll__typeBtn ${type === "SingleChoice" ? "isActive" : ""}`}>
            Single Choice
          </button>

          <button type="button" onClick={() => handleChoiceClick("Rating")}
            className={`createPoll__typeBtn ${type === "Rating" ? "isActive" : ""}`}>
            Rating
          </button>

          <button type="button" onClick={() => handleChoiceClick("ImageBased")}
            className={`createPoll__typeBtn ${type === "ImageBased" ? "isActive" : ""}`}>
            Image Based
          </button>
        </div>
      </div>

      {(type === "SingleChoice" || type === "ImageBased") && (
        <div className="createPoll__section">
          <h4 className="createPoll__label">Options</h4>

          <div className="createPoll__options">
            {quesOptions.map((val, idx) => (
              <OptionAdder
                key={idx}
                idx={idx}
                val={val}
                setQuesOptions={setQuesOptions}
                inputType="text"  // ✅ for ImageBased, enter image URL strings
              />
            ))}
          </div>
        </div>
      )}

      {error && <p className="createPoll__error">{error}</p>}

      <div className="createPoll__actions">
        <button
          className="createPoll__createBtn"
          type="button"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
};

export default CreatePoll;