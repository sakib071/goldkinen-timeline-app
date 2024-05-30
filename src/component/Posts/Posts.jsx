import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

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

    const [expandedComments, setExpandedComments] = useState([]);

    const handleExpandComments = (postId) => {
        if (expandedComments.includes(postId)) {
            setExpandedComments(expandedComments.filter(id => id !== postId));
        } else {
            setExpandedComments([...expandedComments, postId]);
        }
    };

    if (postsQuery.isLoading || usersQuery.isLoading || commentsQuery.isLoading) return 'Loading...';

    if (postsQuery.error || usersQuery.error || commentsQuery.error)
        return `An error has occurred: ${postsQuery.error ? postsQuery.error.message : usersQuery.error.message}`;

    const sortedPosts = postsQuery.data?.sort((a, b) => b.id - a.id);

    return (
        <div className='max-w-2xl mx-auto'>
            {usersQuery.data?.map((user) => (
                <div key={user.id} className='my-8'>
                    {sortedPosts?.filter(post => post.userId === user.id).map((post) => {
                        const comments = commentsQuery.data?.filter(comment => comment.postId === post.id);
                        const isExpanded = expandedComments.includes(post.id);

                        return (
                            <div key={post.id} className='my-4 p-4 bg-white shadow rounded-lg'>
                                <h2 className='text-xl font-semibold text-gray-800'>{user.name}</h2>
                                <div className='text-lg font-semibold'>{post.title}</div>
                                <p className='text-gray-600'>{post.body}</p>
                                <div className='mt-4 flex items-center text-gray-500'>
                                    <button
                                        onClick={() => handleExpandComments(post.id)}
                                        className='flex items-center gap-1 hover:underline focus:outline-none'
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            className={`h-4 w-4 ${isExpanded ? 'text-blue-500 rotate-180' : ''}`}
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M19 9l-7 7-7-7'
                                            />
                                        </svg>
                                        <span className='text-sm'>{isExpanded ? 'Hide comments' : `Show ${comments?.length} comments`}</span>
                                    </button>
                                </div>
                                {isExpanded && (
                                    <div className='mt-4'>
                                        {comments?.map(comment => (
                                            <div key={comment.id} className='my-2 p-3 bg-gray-100 rounded cursor-pointer hover:shadow transition-all ease-in-out'>
                                                <p className='text-sm'>{comment.body}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Posts;
