import React, { useId } from "react";
import { Plus, Trash } from "lucide-react";
import "../style/OptionAdder.css";

const OptionAdder = ({ idx, val, setQuesOptions, inputType }) => {
  const inputId = useId();

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setQuesOptions((prev) => {
      const copy = [...prev];
      copy[idx] = newValue;
      return copy;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setQuesOptions((prev) => {
      const copy = [...prev];
      copy[idx] = url;
      return copy;
    });
  };

  const handleAddition = () => setQuesOptions((prev) => [...prev, ""]);
  const handleRemove = () =>
    setQuesOptions((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next.length === 0 ? [""] : next;
    });

  return (
    <div className="optionAdder">
      <button className="optionAdder__iconBtn" type="button" onClick={handleRemove} aria-label="Remove option">
        <Trash size={18} />
      </button>

      {inputType === "file" ? (
        <div className="optionAdder__file">
          <label className="optionAdder__fileLabel" htmlFor={inputId}>
            Choose image
          </label>

          <input className="optionAdder__fileInput" id={inputId} type="file" accept="image/*" onChange={handleFileChange} />

          {val && <img className="optionAdder__preview" src={val} alt={`Option ${idx + 1}`} />}
        </div>
      ) : (
        <input className="optionAdder__textInput" type="text" value={val} placeholder={`Option ${idx + 1}`} onChange={handleTextChange} />
      )}

      <button className="optionAdder__iconBtn optionAdder__iconBtn--add" type="button" onClick={handleAddition} aria-label="Add option">
        <Plus size={18} />
      </button>
    </div>
  );
};

export default OptionAdder;
