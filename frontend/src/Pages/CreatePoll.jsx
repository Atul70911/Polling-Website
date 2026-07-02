import React, { useState } from "react";
import OptionAdder from "../Components/OptionAdder";
import { useApp } from "../ContextProvider/AppContext";
import { BarChart2, ToggleLeft, Star, Image, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

const POLL_TYPES = [
  { value: "YesNo",        label: "Yes / No",       icon: ToggleLeft,  desc: "Simple yes or no vote" },
  { value: "SingleChoice", label: "Single Choice",  icon: BarChart2,   desc: "Pick one from options" },
  { value: "Rating",       label: "Rating",         icon: Star,        desc: "Rate from 1 to 5 stars" },
  { value: "ImageBased",   label: "Image Based",    icon: Image,       desc: "Vote on images" },
];

const CreatePoll = () => {
  const [type, setType]               = useState("");
  const [question, setQuestion]       = useState("");
  const [quesOptions, setQuesOptions] = useState([""]);

  const { createPoll, fetchFeed, setPage, loading, error, setError } = useApp();

  const handleChoiceClick = (t) => {
    setType(t);
    setQuesOptions([""]);
    setError?.("");
  };

  const handleCreate = async () => {
    setError?.("");
    if (!type)              return setError?.("Please select a poll type");
    if (!question.trim())   return setError?.("Question is required");

    let payload = { type, question: question.trim() };

    if (type === "SingleChoice" || type === "ImageBased") {
      const options = quesOptions.map((o) => String(o || "").trim()).filter(Boolean);
      if (options.length < 2) return setError?.("At least 2 options are required");
      payload.options = options;
    }

    try {
      await createPoll(payload);
      await fetchFeed();
      setType("");
      setQuestion("");
      setQuesOptions([""]);
      setPage("DashBoard");
      toast.success("Poll Created")
    } catch (e) {
      toast.error(e);
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create a Poll</h1>
        <p className="text-sm text-gray-500 mt-1">Ask your community anything.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6">

        {/* Question */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Question
          </label>
          <textarea
            rows={3}
            value={question}
            placeholder="What would you like to ask?"
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Poll Type */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-3">
            Poll Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {POLL_TYPES.map(({ value, label, icon: Icon, desc }) => {
              const isActive = type === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChoiceClick(value)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    isActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <Icon size={18} className={isActive ? "text-blue-700" : "text-gray-500"} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? "text-blue-700" : "text-gray-800"}`}>
                      {label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Options — SingleChoice or ImageBased */}
        {(type === "SingleChoice" || type === "ImageBased") && (
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">
              {type === "ImageBased" ? "Image URLs" : "Options"}
            </label>
            <div className="flex flex-col gap-2">
              {quesOptions.map((val, idx) => (
                <OptionAdder
                  key={idx}
                  idx={idx}
                  val={val}
                  setQuesOptions={setQuesOptions}
                  inputType="text"
                />
              ))}
            </div>
          </div>
        )}

        {/* YesNo info */}
        {type === "YesNo" && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <ToggleLeft size={20} className="text-green-600 shrink-0" />
            <p className="text-sm text-green-700">
              This poll will show a <strong>Yes</strong> and <strong>No</strong> button to voters. No options needed.
            </p>
          </div>
        )}

        {/* Rating info */}
        {type === "Rating" && (
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <Star size={20} className="text-yellow-500 shrink-0" />
            <p className="text-sm text-yellow-700">
              Voters will rate from <strong>1 to 5 stars</strong>. No options needed.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setPage("DashBoard")}
            className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle size={16} />
            {loading ? "Creating..." : "Create Poll"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreatePoll;