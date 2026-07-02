import React, { useState } from "react";
import { useApp } from "../ContextProvider/AppContext";
import { ArrowLeft, ShieldCheck, User } from "lucide-react";
import { timeAgo } from "../utils/time";
import toast from 'react-hot-toast';
import ImageBasedVoting from "../Components/ImageBasedVoting"
import YesNoVoting from "../Components/YesNoVoting"
import RatingVoting from "../Components/RatingVoting"
import SingleChoiceVoting from "../Components/SingleChoiceVoting"



export default function ViewPoll() {
  const { selectedPoll, setPage, submitVote, getErrMsg } = useApp();
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  console.log(selectedPoll);

  if (!selectedPoll) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-sm">
      <p>No poll selected.</p>
      <button onClick={() => setPage("DashBoard")} className="mt-3 text-blue-600 underline">
        Back to feed
      </button>
    </div>
  );

  const label = selectedPoll.category || selectedPoll.type || "";
  const totalVotes = selectedPoll.voters?.length ?? 0;


  const handleSubmit = async () => {
    if (hasVoted || selectedOption === null) return;
    try {
      let payload = {};
      switch (selectedPoll.type) {
        case "SingleChoice":
        case "ImageBased":
          payload = { optionIndex: selectedOption };
          break;
        case "YesNo":
          payload = { vote: selectedOption };
          break;
        case "Rating":
          payload = { rating: selectedOption };
          break;
        default:
          return;
      }
      await submitVote(selectedPoll._id, payload);
      setHasVoted(true);
      toast.success("Vote submitted!");
    } catch (err) {
      toast.error(getErrMsg(err));
    }
  };

  const renderVotingUI = () => {
    switch (selectedPoll.type) {
      case "SingleChoice":
        return (
          <SingleChoiceVoting
            options={selectedPoll.options || []}
            selected={selectedOption}
            onSelect={setSelectedOption}
            hasVoted={hasVoted}
          />
        );
      case "ImageBased":
        return (
          <ImageBasedVoting
            options={selectedPoll.options || []}
            selected={selectedOption}
            onSelect={setSelectedOption}
            hasVoted={hasVoted}
          />
        );
      case "YesNo":
        return (
          <YesNoVoting
            selected={selectedOption}
            onSelect={setSelectedOption}
            hasVoted={hasVoted}
            poll={selectedPoll}
          />
        );
      case "Rating":
        return (
          <RatingVoting
            selected={selectedOption}
            onSelect={setSelectedOption}
            hasVoted={hasVoted}
            poll={selectedPoll}
          />
        );
      default:
        return <p className="text-sm text-gray-400">Unknown poll type.</p>;
    }
  };

  const getSubtitle = () => {
    switch (selectedPoll.type) {
      case "SingleChoice": return "Select one option. This poll is anonymous.";
      case "ImageBased":   return "Click an image to cast your vote.";
      case "YesNo":        return "Cast your vote — Yes or No.";
      case "Rating":       return "Rate from 1 to 5 stars.";
      default:             return "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">

      {/* Back */}
      <button
        onClick={() => setPage("DashBoard")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Back to feed
      </button>

      {/* Badge */}
      <span className="text-[11px] font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full uppercase tracking-widest">
        {label}
      </span>

      {/* Question */}
      <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-5 leading-tight">
        {selectedPoll.question}
      </h1>

      {/* Author */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
          {selectedPoll.creator?.avatar
            ? <img src={selectedPoll.creator.avatar} alt="" className="w-full h-full object-cover" />
            : <User size={20} className="text-gray-400" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {selectedPoll.creator?.name || "Anonymous"}
          </p>
          <p className="text-xs text-gray-500">
            {timeAgo(selectedPoll.createdAt)}
          </p>
        </div>
      </div>

      {/* Voting card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h2 className="text-base font-bold text-gray-900 mb-1">Cast Your Vote</h2>
        <p className="text-sm text-gray-500 mb-5">{getSubtitle()}</p>

        {renderVotingUI()}

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null || hasVoted}
            className="px-6 py-2.5 bg-[#1a2744] text-white text-sm font-semibold rounded-lg
                       hover:bg-[#14203a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {hasVoted ? "Vote Submitted ✓" : "Submit Vote"}
          </button>
          <span className="text-sm text-gray-500">
            {totalVotes.toLocaleString()} total votes
          </span>
        </div>
      </div>

    </div>
  );
}