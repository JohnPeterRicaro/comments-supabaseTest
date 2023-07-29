import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Comments  from "./lib/comments.jsx"
import CreateComment from "./lib/createComment.jsx"

const queryClient = new QueryClient()

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
    <QueryClientProvider client={queryClient}>
      <Comments />
      <CreateComment/>
    </QueryClientProvider>
    </div>
  )
}
