import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById } from '../Services/PostService'; // Update with correct path
import PostCard from '../Pages/Post/PostCard'; // If you want to reuse it

export default function SinglePostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams();

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        setError(null);
        
        // Clean the ID by removing ': id' prefix
        const cleanId = String(id).replace(/^:\s*id/, '').trim();
        
        const response = await getPostById(cleanId);
        
        if (response.message === 'success' && response.post) {
          setPost(response.post);
        } else {
          setError('Failed to load post');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to Feed
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg mb-4">Post not found</p>
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-blue-500 hover:underline mb-4">
        ← Back to Feed
      </Link>
      
      {/* Reuse your PostCard component */}
      <PostCard post={post} commentsLimit={post.comments.length + 1} />
      
      {/* Or create custom detailed view */}
      {/* <div className="bg-white rounded-lg shadow-md">
        ... custom post details
      </div> */}
    </div>
  );
}