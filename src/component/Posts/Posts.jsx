import { useQueries } from '@tanstack/react-query';
import axios from 'axios';

const Posts = () => {
    const [postsQuery, usersQuery, commentsQuery] = useQueries({
        queries: [
            {
                queryKey: ['posts'],
                queryFn: () => axios.get('https://jsonplaceholder.typicode.com/posts').then(res => res.data),
            },
            {
                queryKey: ['users'],
                queryFn: () => axios.get('https://jsonplaceholder.typicode.com/users').then(res => res.data),
            },
            {
                queryKey: ['comments'],
                queryFn: () => axios.get('https://jsonplaceholder.typicode.com/comments').then(res => res.data),
            },
        ],
    });

    if (postsQuery.isLoading || usersQuery.isLoading || commentsQuery.isLoading) return 'Loading...';

    if (postsQuery.error || usersQuery.error || commentsQuery.isLoading)
        return 'An error has occurred: ' + (postsQuery.error ? postsQuery.error.message : usersQuery.error.message);

    const postID = postsQuery.data?.[0]?.userId; // Ensure this is accessed correctly
    const userID = usersQuery.data?.[0]?.id; // Ensure this is accessed correctly
    const commentID = commentsQuery.data?.[0]?.id;

    console.log('postID:', postID, 'userID:', userID, 'commentID:', commentID);
    const filteredComments = commentsQuery.data?.filter(comment => comment.postId === postID);


    return (
        <div>
            {usersQuery.data?.map((user) => {
                if (postID === user.id) {
                    return (
                        <div key={user.id} className='max-w-2xl mx-auto'>
                            {
                                postsQuery.data?.filter(post => post.userId === userID).map((post) => (
                                    <div key={post.id} className='w-full my-5 p-8 space-y-2 rounded-lg border shadow'>
                                        <div className='text-gray-500 font-bold text-2xl'>{user.name}</div>
                                        <div className='text-lg font-semibold'>{post.title}</div>
                                        <div className='text-gray-500'>{post.body}</div>
                                        <div className="flex items-center gap-1 text-gray-500 mt-4 hover:underline cursor-pointer">
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

                                            <p className="text-xs">{filteredComments?.length} comments</p>
                                        </div>
                                        <div className='mt-4 '>
                                            {filteredComments?.map(comment => (
                                                <div key={comment.id} className='mt-2 p-3 bg-gray-100 rounded cursor-pointer hover:shadow transition-all ease-in-out'>
                                                    <div className='text-sm p-'>{comment.body}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default Posts;
