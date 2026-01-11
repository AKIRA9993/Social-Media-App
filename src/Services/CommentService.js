import axios from "axios";

// Base URL for the API
const BASE_URL = 'https://linked-posts.routemisr.com';

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Get all comments for a specific post
export async function getPostComments(postId) {
    try {
        console.log('Fetching comments for post ID:', postId);
        const token = getToken();
        
        const { data } = await axios.get(
            `${BASE_URL}/posts/${postId}/comments`,
            {
                headers: {
                    token: token
                }
            }
        );
        
        console.log('API Response - getPostComments:', data);
        return data;
    } catch (err) {
        console.error('API Error - getPostComments:', err.response?.data || err.message);
        return { message: 'error', comments: [] };
    }
}

// Create a comment 
export async function createCommentApi(content, post) {
    try {
        const { data } = await axios.post(
            `${BASE_URL}/comments`,
            {
                content,
                post
            },
            {
                headers: {
                    token: getToken()
                }
            }
        );
        
        console.log('API Response - createCommentApi:', data);
        return data;
    } catch (err) {
        console.error('API Error - createCommentApi:', err.response?.data || err.message);
        return { message: 'error', comments: [] };
    }
}

// Delete a comment
export async function deleteComment(postId, commentId) {
    try {
        console.log('Deleting comment ID:', commentId, 'from post ID:', postId);
        const token = getToken();
        
        const { data } = await axios.delete(
            `${BASE_URL}/posts/${postId}/comments/${commentId}`,
            {
                headers: {
                    token: token
                }
            }
        );
        
        console.log('API Response - deleteComment:', data);
        return data;
    } catch (err) {
        console.error('API Error - deleteComment:', err.response?.data || err.message);
        return { message: 'error' };
    }
}

// Update a comment
export async function updateComment(postId, commentId, commentContent) {
    try {
        console.log('Updating comment ID:', commentId, 'on post ID:', postId);
        const token = getToken();
        
        const { data } = await axios.put(
            `${BASE_URL}/comments/${commentId}`,
            { content: commentContent },
            {
                headers: {
                    token: token
                }
            }
        );
        
        console.log('API Response - updateComment:', data);
        return data;
    } catch (err) {
        console.error('API Error - updateComment:', err.response?.data || err.message);
        return { message: 'error' };
    }
}