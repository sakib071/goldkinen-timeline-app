// const getPost = async () => {
//     const res = await fetch("https://jsonplaceholder.typicode.com/posts");
//     const data = await res.json();
//     return data;
// };

// export default getPost;

import axios from 'axios';

export const fetchUser = async () => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
    return data;
};

export const fetchPosts = async () => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts');
    return data;
};

export const fetchComments = async () => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/comments');
    return data;
};