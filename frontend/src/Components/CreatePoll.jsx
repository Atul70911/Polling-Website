import React, { useState } from "react";
import OptionAdder from "./OptionAdder";
import "../style/CreatePoll.css";
import { useApp } from "../ContextProvider/AppContext";

const initialYesNo = { type: "YesNo", id: 0, question: "", yes: 0, no: 0 };
const initialRating = { type: "Rating", id: 0, question: "", rating: 0 };
const initialSingleChoice = {
  type: "SingleChoice",
  id: 0,
  question: "",
  options: [],
};
const initialImageBased = {
  type: "ImageBased",
  id: 0,
  question: "",
  options: [],
};

const CreatePoll = () => {
  // form state (local)
  const [type, setType] = useState("");
  const [question, setQuestion] = useState("");
  const [quesOptions, setQuesOptions] = useState([""]);

  // global poll lists (context)
  const {
    setYesNoList,
    setRatingList,
    setSingleChoiceList,
    setImageBasedList,
  } = useApp();

  const handleChoiceClick = (t) => {
    setType(t);

    // reset options depending on type
    if (t === "SingleChoice" || t === "ImageBased") setQuesOptions([""]);
    else setQuesOptions([""]); // keep safe default (not used for YesNo/Rating UI)
  };

  const handleCreate = () => {
    if (!type) return;
    if (!question.trim()) return;

    const id = Date.now();

    if (type === "YesNo") {
      const poll = { ...initialYesNo, id, question, yes: 0, no: 0 };
      setYesNoList((prev) => [...prev, poll]);
      setType("");
      setQuestion("");
      return;
    }

    if (type === "Rating") {
      const poll = { ...initialRating, id, question, rating: 0 };
      setRatingList((prev) => [...prev, poll]);
      setType("");
      setQuestion("");
      return;
    }

    if (type === "SingleChoice") {
      const poll = {
        ...initialSingleChoice,
        id,
        question,
        options: quesOptions,
      };
      setSingleChoiceList((prev) => [...prev, poll]);
      setType("");
      setQuestion("");
      setQuesOptions([""]);
      return;
    }

    if (type === "ImageBased") {
      const poll = {
        ...initialImageBased,
        id,
        question,
        options: quesOptions, // array of text OR blob URLs (based on OptionAdder inputType)
      };
      setImageBasedList((prev) => [...prev, poll]);
      setType("");
      setQuestion("");
      setQuesOptions([""]);
      return;
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
          <button
            className={`createPoll__typeBtn ${type === "YesNo" ? "isActive" : ""}`}
            type="button"
            onClick={() => handleChoiceClick("YesNo")}
          >
            Yes/No
          </button>

          <button
            className={`createPoll__typeBtn ${type === "SingleChoice" ? "isActive" : ""}`}
            type="button"
            onClick={() => handleChoiceClick("SingleChoice")}
          >
            Single Choice
          </button>

          <button
            className={`createPoll__typeBtn ${type === "Rating" ? "isActive" : ""}`}
            type="button"
            onClick={() => handleChoiceClick("Rating")}
          >
            Rating
          </button>

          <button
            className={`createPoll__typeBtn ${type === "ImageBased" ? "isActive" : ""}`}
            type="button"
            onClick={() => handleChoiceClick("ImageBased")}
          >
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
                inputType={type === "ImageBased" ? "file" : "text"}
              />
            ))}
          </div>
        </div>
      )}

      <div className="createPoll__actions">
        <button
          className="createPoll__createBtn"
          type="button"
          onClick={handleCreate}
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreatePoll;
