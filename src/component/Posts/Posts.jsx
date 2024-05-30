import { useQueries } from '@tanstack/react-query';
import { fetchUser, fetchPosts, fetchComments } from './getPost';

const Posts = ({ id }) => {
    const queryResults = useQueries({
        queries: [
            {
                queryFn: () => fetchUser(id),
            },
            {
                queryFn: () => fetchPosts(id),
            },
            {
                queryFn: async () => {
                    const posts = await fetchPosts(id);
                    return fetchComments(posts[0]?.id);
                },
                // enabled: !!id,
            },
        ],
    });

    const [userResult, postsResult, commentsResult] = queryResults;

    if (queryResults.some(result => result.isLoading)) return <div>Loading...</div>;
    if (queryResults.some(result => result.isError)) return <div>Error loading data</div>;

    const user = userResult.data;
    const posts = postsResult.data;
    const comments = commentsResult.data;

    return (
        <div className='max-w-xl mx-auto'>
            {
                posts.map(post => (
                    <article key={post.id} className="rounded-xl border-2 border-gray-100 bg-white mt-5">
                        <div className="gap-4 p-8">
                            <div>
                                <h2>Name: {user.name}</h2>
                                <p>{user.email}</p>
                            </div>
                            <div>
                                <p className="block text-xs sm:text-gray-500">
                                    <a href="#" className="font-medium underline hover:text-gray-700"> {user.name} </a>
                                </p>
                                <h3 className="font-medium sm:text-lg">
                                    <a href="#" className="hover:underline">Post title: {post.title}</a>
                                </h3>

                                <p className="line-clamp-2 text-sm text-gray-700">Body: {post.body}</p>

                                <div className="mt-2 sm:flex sm:items-center sm:gap-2">
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                            />
                                        </svg>

                                        <p className="text-xs">14 comments</p>
                                        <ul>
                                            {comments.map(comment => (
                                                <li key={comment.id}>{comment.body}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                ))
            }
        </div>
    );
};

export default Posts;
