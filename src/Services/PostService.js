import axios from "axios";

// Base URL for the API
const BASE_URL = 'https://linked-posts.routemisr.com';

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Get all posts with pagination
export async function getPosts(limit = 20) {
    console.log('Fetching posts with limit:', limit);
    const token = getToken();
    
    const response = await axios.get(`${BASE_URL}/posts`, {
        headers: {
            token: token
        },
        params: {
            limit: limit,
            // shows the posts from most recent to oldest when u add "-" when u remove it, it just shows from oldest to most recent
            sort: '-createdAt'
        }
    });
    
    console.log('API Response - getPosts:', response.data);
    console.log('Total posts fetched:', response.data.posts?.length || 0);
    return response;
}

// Get a single post by ID
export async function getPostById(postId) {
    try {
        const cleanId = String(postId).replace(/^:\s+/, '').trim();
        const token = getToken();
        
        const { data } = await axios.get(`${BASE_URL}/posts/${cleanId}`, {
            headers: {
                token: token
            }
        });
        
        console.log('API Response - getPostById:', data);
        return data;
    } catch (err) {
        console.error('API Error - getPostById:', err.response?.data || err.message);
        return { message: 'error', post: null };
    }
}

// Create a new post 
export async function CreatePostApi(formdata) {
    try {
        console.log('Creating new post');
        const token = getToken();
        
        const { data } = await axios.post(`${BASE_URL}/posts`, formdata, {
            headers: {
                token: token
            }
        });
        
        console.log('API Response - CreatePostApi:', data);
        return data;
    } catch (err) {
        console.error('API Error - CreatePostApi:', err.response?.data || err.message);
        return { message: 'error', posts: [] };
    }
}

// Delete a post
export async function deletePost(postId) {
    try {
        console.log('Deleting post ID:', postId);
        const token = getToken();
        
        const { data } = await axios.delete(`${BASE_URL}/posts/${postId}`, {
            headers: {
                token: token
            }
        });
        
        console.log('API Response - deletePost:', data);
        return data;
    } catch (err) {
        console.error('API Error - deletePost:', err.response?.data || err.message);
        return { message: 'error' };
    }
}