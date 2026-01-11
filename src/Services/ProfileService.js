import axios from "axios";

// Base URL for the API
const BASE_URL = 'https://linked-posts.routemisr.com';

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Get user profile data
export async function getUserProfile() {
    console.log('Fetching user profile data...');
    const token = getToken();
    
    // Make GET request to fetch profile data
    const response = await axios.get(`${BASE_URL}/users/profile-data`, {
        headers: {
            token: token // Send token in headers for authentication
        }
    });
    
    console.log('API Response - getUserProfile:', response.data);
    return response; // Return full response for TanStack Query
}

// Get current user's posts by fetching all posts and filtering
export async function getUserPosts(limit = 10) {
    console.log('Fetching user posts...');
    const token = getToken();
    
    try {
        // First get user profile to get their ID
        const profileResponse = await axios.get(`${BASE_URL}/users/profile-data`, {
            headers: {
                token: token
            }
        });
        
        const userId = profileResponse.data.user._id;
        
        // Then fetch all posts
        const postsResponse = await axios.get(`${BASE_URL}/posts`, {
            headers: {
                token: token
            },
            params: {
                limit: limit * 2, // Get more posts to account for filtering
                sort: '-createdAt'
            }
        });
        
        // Filter posts to only show user's posts
        const userPosts = postsResponse.data.posts.filter(post => post.user?._id === userId);
        return { data: { posts: userPosts } };
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return { data: { posts: [] } };
    }
}

// Upload user profile photo
export async function uploadProfilePhoto(photoFile) {
    console.log('Uploading profile photo...');
    const token = getToken();
    
    // Create FormData to send the file
    const formData = new FormData();
    formData.append('photo', photoFile); // Append the photo file
    
    // Make PUT request to upload photo
    const response = await axios.put(`${BASE_URL}/users/upload-photo`, formData, {
        headers: {
            token: token, // Send token for authentication
            'Content-Type': 'multipart/form-data' // Required for file upload
        }
    });
    
    console.log('API Response - uploadProfilePhoto:', response.data);
    return response; // Return full response
}