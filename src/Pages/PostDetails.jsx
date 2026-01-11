import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPostById } from '../Services/PostService';
import PostCard from '../Pages/Post/PostCard';

export default function PostDetails() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  // Fetch single post by ID
  async function getPost() {
    console.log('Fetching post details for ID:', id);
    setLoading(true);
    
    const response = await getPostById(id);
    console.log('Post details response:', response);
    
    if (response.message === 'success') {
      setPost(response.post);
      console.log('Post loaded successfully:', response.post);
    } else {
      console.log('Failed to load post');
      setPost(null);
    }
    
    setLoading(false);
  }

  useEffect(() => {
    getPost();
  }, [id]); // Re-fetch if ID changes

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-xl mx-auto">
        
        {/* Loading state */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Loading post...</p>
          </div>
        ) : post ? (
          // Display post using PostCard component
          <>
            {/* Back button */}
            <button 
              onClick={() => window.history.back()}
              className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Back to feed
            </button>
            
            {/* Post details */}
            <PostCard post={post} />
          </>
        ) : (
          // Error state - post not found
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-red-600 font-semibold mb-2">Post not found</p>
            <p className="text-gray-500 mb-4">The post you're looking for doesn't exist or has been deleted.</p>
            <button 
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to feed
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}