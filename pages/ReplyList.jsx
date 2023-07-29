import { useState } from "react";
import { supabase } from "./lib/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function ReplyList({ commentID }) {
  const [isEditing, setIsEditing] = useState("");
  const [isEditingId, setIsEdtingId] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const fetchReplies = async () => {
    const { data, error } = await supabase
      .from("replies")
      .select()
      .eq("comment_id", commentID);

    if (error) throw new Error(error.message);
    return data;
  };

  const queryClient = useQueryClient();
  const { data, status } = useQuery(["replies", commentID], fetchReplies);

  const handleEdit = ({ id, text }) => {
    setIsEditing(text);
    setIsEdtingId(id);
  };

  const { mutate: mutateEditReply, isLoading } = useMutation(
    async () => {
      const { data, error } = await supabase
        .from("replies")
        .update({ replyinput: isEditing })
        .eq("id", isEditingId);

      if (error) throw new Error(error.message);

      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["replies"]);
        setIsEditing("");
        setIsEdtingId(null);
      },
    }
  );

  const mutateDelete = useMutation(
    async () => {
      const { data, error } = await supabase
        .from("replies")
        .delete()
        .eq("id", isDeletingId);

      if (error) throw new Error(error.message);

      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["replies"]);
        setIsDeletingId(null);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutateEditReply();
  };

  const handleDelete = () => {
    mutateDelete.mutate();
  };

  return (
    <>
      <ul className="mt-[20px]" key={commentID}>
        {status === "loding" && <div>loading...</div>}
        {status === "error" && <div>Error fetching replies.</div>}
        {status === "success" &&
          data.map((reply) => (
            <li className="mt-[10px]" key={reply.id}>
              <div className="w-full flex justify-end items-center">
                <form
                  onSubmit={handleSubmit}
                  className="w-[90%] bg-gray-50 p-[20px] rounded-lg shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className=" font-bold text-gray-800">
                        {reply.username}
                      </h1>
                      <h2 className=" text-sm text-gray-400">
                        {reply.replystamp}
                      </h2>
                    </div>
                    <div className="flex gap-[10px] justify-center items-center">
                      {isEditingId === reply.id ? (
                        <button
                          disabled={isLoading}
                          className="py-1 px-3 rounded-full text-white font-semibold bg-blue-400 transition cursor-pointer"
                        >
                          {isLoading ? "Saving..." : "Save"}
                        </button>
                      ) : (
                        <div
                          onClick={() => {
                            handleEdit({
                              id: reply.id,
                              text: reply.replyinput,
                            });
                          }}
                          type="button"
                          className="py-1 px-3 rounded-full text-white font-semibold bg-blue-400 transition hover:bg-blue-600 cursor-pointer"
                        >
                          Edit
                        </div>
                      )}
                      ,
                      <div
                        onClick={() => {
                          setIsDeletingId(reply.id);
                          handleDelete();
                        }}
                        className="py-1 px-3 rounded-full text-white font-semibold bg-red-400 transition hover:bg-red-600 cursor-pointer"
                      >
                        Delete
                      </div>
                    </div>
                  </div>
                  <div className="mt-[10px] w-full">
                    {
                      isEditingId === reply.id ? (
                        <textarea
                        type="text"
                        autoFocus
                        value={isEditing}
                        onChange={(e) => {
                          setIsEditing(e.target.value)
                        }}
                        className="text-sm text-left text-gray-600 w-full h-[100px] p-2 resize-none rounded-lg"
                        />
                      ):(<p>{reply.replyinput}</p>)
                    }
                  </div>
                </form>
              </div>
            </li>
          ))}
      </ul>
    </>
  );
}
