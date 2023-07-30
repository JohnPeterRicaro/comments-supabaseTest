import { useState } from "react";
import { supabase } from "../api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { replyHandler, ReplyForm } from "../pages/ReplyComment";
import { ReplyList } from "../pages/ReplyList";

export default function Comments() {
  const [editingCommentId, setEditingCommentID] = useState(null);
  const [editingComment, setEditingComment] = useState("");
  const [deletingCommentID, setDeletingCommentID] = useState(null);

  const fetchComments = async () => {
    const { data, error } = await supabase.from("comments").select();
    if (error) throw new Error(error.message);
    return data;
  };
  const queryClient = useQueryClient();
  const { data, status } = useQuery(["comments"], fetchComments);

  const handleEdit = ({ id, text }) => {
    setEditingComment(text);
    setEditingCommentID(id);
  };

  const { mutate: mutateEditComment, isLoading } = useMutation(
    async () => {
      const { data, error } = await supabase
        .from("comments")
        .update({ textinput: editingComment })
        .eq("id", editingCommentId);

      if (error) throw new Error(error.message);

      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["comments"]);
        setEditingCommentID(null);
        setEditingComment("");
      },
    }
  );

  const mutateDelete = useMutation(
    async () => {
      const { data, error } = await supabase
        .from("comments")
        .delete()
        .eq("id", deletingCommentID);

      if (error) throw new Error(error.message);

      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["comments"]);
        setDeletingCommentID(null);
      },
    }
  );
  const handleDelete = () => {
    mutateDelete.mutate();
  };

  return (
    <ul>
      {data.map((comment) => {
        const handleSubmit = (e) => {
          e.preventDefault();
          mutateEditComment();
        };
        return (
          <li className="w-[450px] h-auto mt-[40px] mb-[40px]" key={comment.id}>
            <div className="space-y-[20px] bg-gray-50 p-[40px] rounded-lg shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="w-full flex justify-between items-center">
                  <div className="">
                    <h1 className=" font-bold text-lg text-gray-700">
                      {comment.username}
                    </h1>
                    <h2 className=" text-sm text-gray-500">{comment.date}</h2>
                  </div>
                  <div className="space-x-[6px] flex justify-between">
                    {editingCommentId === comment.id ? (
                      <button
                        disabled={isLoading}
                        className="py-1 px-3 rounded-full text-white font-semibold bg-blue-400 transition cursor-pointer"
                      >
                        {isLoading ? "Saving..." : "Save"}
                      </button>
                    ) : (
                      <div
                        onClick={() =>
                          handleEdit({
                            id: comment.id,
                            text: comment.textinput,
                          })
                        }
                        type="button"
                        className="py-1 px-3 rounded-full text-white font-semibold bg-blue-400 transition hover:bg-blue-600 cursor-pointer"
                      >
                        Edit
                      </div>
                    )}
                    ,
                    <button
                      onClick={() => {
                        setDeletingCommentID(comment.id);
                        handleDelete();
                      }}
                      className="py-1 px-3 rounded-full text-white font-semibold bg-red-400 transition hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="w-full">
                  {editingCommentId === comment.id ? (
                    <textarea
                      type="text"
                      autoFocus
                      value={editingComment}
                      onChange={(e) => {
                        setEditingComment(e.target.value);
                      }}
                      className="text-sm text-left text-gray-600 w-full h-[100px] p-2 resize-none rounded-lg"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{comment.textinput}</p>
                  )}
                </div>
              </form>
              <ReplyForm commentID={comment.id}/>
            </div>
              <ReplyList commentID={comment.id}/>
          </li>
        );
      })}
    </ul>
  );
}
