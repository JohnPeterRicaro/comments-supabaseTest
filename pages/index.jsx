import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Comments  from "../components/comments.jsx"
import CreateComment from "../components/createComment.jsx"

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
