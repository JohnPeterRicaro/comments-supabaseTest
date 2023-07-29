import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "./api/supabaseClient";
import uuid from "react-uuid";

const CreateComment = () => {
  const [createComment, setCreateComment] = useState("");
  const [createUserName, setCreateUserName] = useState("");
  const [createTimeStamp, setCreateTimeStamp] = useState(null);
  const [createId, setCreateId] = useState(null);

  const fetchComments = async () => {
    const { data, error } = await supabase.from("comments").select();
    if (error) throw new Error(error.message);
    return data;
  };

  const queryClient = useQueryClient();
  const { status } = useQuery(["comments"], fetchComments);

  const handleCreate = () => {
    mutateCreateComment()
  };

  const { mutate: mutateCreateComment, isLoading } = useMutation(
    async () => {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          id: createId,
          username: createUserName,
          textinput: createComment,
          date: createTimeStamp,
        });

      if (error) throw new Error(error.message);

      return data;
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["comments"]);
        setCreateId(null);
        setCreateUserName("");
        setCreateComment("");
        setCreateTimeStamp(null);
      },
    }
  );

  const timeNow = (currentTime) => {
    const stamp = new Date().toJSON()
    return (currentTime = stamp);
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "error") return <div>Error Fetching Data</div>;

  const handleSubmit = (e) =>{
    e.prevetDefault()
    mutateCreateComment()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-[40px] p-[40px] rounded-lg flex flex-col justify-center items-center gap-[20px] bg-gray-50 shadow-lg">
      <div className="w-full flex flex-start items-center gap-[20px]">
        <label>Username:</label>
        <input
          onChange={(e) => {
            setCreateUserName(e.target.value);
          }}
          className="rounded-lg shadow-sm"
          type="text"
        />
      </div>
      <div className="flex justify-center items-center gap-[20px]">
        <textarea
          onChange={(e) => {
            setCreateComment(e.target.value);
          }}
          className="w-[350px] h-[150px] rounded-lg shadow-sm resize-none"
        />
        <div
          onClick={() => {            
            const randomId = uuid();
            setCreateTimeStamp(timeNow);
            setCreateId(randomId)
            console.log(createTimeStamp);
            handleCreate();
          }}
          type="button"
          disabled={isLoading}
          className="py-1 px-3 rounded-full text-white font-semibold bg-blue-400 transition hover:bg-blue-600 cursor-pointer"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </div>
      </div>
    </form>
  );
};

export default CreateComment;
