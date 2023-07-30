import { useState } from "react";
import { supabase } from "../api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import uuid from "react-uuid";

export default function ReplyForm({ commentID }) {
  const [isReplying, setIsReplying] = useState(false);
  const [isID, setIsID] = useState(null);
  const [isUsername, setIsUsername] = useState("");
  const [isCommentId, setIsCommentId] = useState(null);
  const [isReply, setIsReply] = useState("");
  const [createTime, setIsCreateTime] = useState(null);

  const handleReply = () => {
    setIsReplying(true);
  };

  const fetchReplies = async () => {
    const { data, error } = await supabase.from("replies").select();
    if (error) throw new Error(error.message);
    return data;
  };
  const queryClient = useQueryClient();
  const { data, status } = useQuery(["replis"], fetchReplies);

  const handleCreate = () => {
    mutateCreateReply();
  };

  const { mutate: mutateCreateReply, isLoading } = useMutation(
    async () => {
      const { data, error } = await supabase.from("replies").insert({
        id: isID,
        username: isUsername,
        comment_id: isCommentId,
        replyinput: isReply,
        replystamp: createTime,
      });

      if (error) throw new Error(error.message);

      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("replies");
        setIsID(null);
        setIsUsername("");
        setIsCommentId("");
        setIsCommentId(null);
        setIsReply("");
        setIsCreateTime(null);
      },
    }
  );

  if (status === "loading") return <div>Loading...</div>;
  if (status === "error") return <div>Error Fetching Data.</div>;

  const timeNow = (currentTime) => {
    const stamp = new Date().toISOString();
    return (currentTime = stamp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutateCreateReply();
  };

  return (
    <>
      <div className="w-full flex justify-end items-center">
        <button
          onClick={handleReply}
          className="py-1 px-3 rounded-full text-white font-semibold bg-blue-400 flex justify-center items-center gap-[10px] transition hover:bg-blue-600 cursor-pointer"
        >
          <h1 className="font-bold">Reply</h1>
          <svg
            className="h-[14px] w-[14px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              className="fill-white"
              d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"
            />
            {/* Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
          </svg>
        </button>
      </div>
      {isReplying && (
        <form
          onSubmit={handleSubmit}
          className="mt-[10px] bg-gray-50 p-[20px] rounded-lg shadow-lg gap-[20px] flex flex-col justify-center items-center"
        >
          <div className="w-full flex justify-start items-center gap-[10px]">
            <label>Username:</label>
            <input
              autoFocus
              onChange={(e) => {
                setIsUsername(e.target.value);
              }}
              className="rounded-lg shadow-sm"
              type="text"
            />
          </div>
          <textarea
            onChange={(e) => {
              setIsReply(e.target.value);
            }}
            className=" w-full h-[80px] rounded-lg resize-none"
          />
          <div className="w-full gap-[10px] flex justify-end items-center">
            <div
              onClick={() => {
                const randomId = uuid();
                setIsCreateTime(timeNow);
                setIsID(randomId);
                setIsCommentId(commentID);
                console.log(createTime);
                handleCreate();
              }}
              type="button"
              className="py-1 px-3 rounded-full text-white font-semibold bg-blue-400 transition hover:bg-blue-600 cursor-pointer"
            >
              Submit
            </div>
            <div
              onClick={() => setIsReplying(false)}
              className="py-1 px-3 rounded-full text-white font-semibold bg-red-400 transition hover:bg-red-600"
            >
              Cancel
            </div>
          </div>
        </form>
      )}
    </>
  );
}
