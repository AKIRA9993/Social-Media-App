import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostHeader from "./PostHeaders";
import PostBody from "./PostBody";
import PostActions from "./PostActions";
import PostComments from "./PostComment";
import { createCommentApi, getPostComments, updateComment as updateCommentApi } from "../../Services/CommentService";
import { useAuthRedirect } from "../../Hooks/useAuthRedirect";
import { Spinner } from "@heroui/react";


export default function PostCard({ post, commentsLimit, callback }) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [loading, setLoading] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  
  // Get the auth redirect hook
  const requireLogin = useAuthRedirect();

  function reverseComments(){
    let newComments = structuredClone(comments);
    newComments.reverse();
    setComments(newComments);
  }

  async function createComment(e) {
    e.preventDefault();
    
    // Check if user is logged in before creating comment
    if (!requireLogin()) return;
    
    setLoading(true);
    const response = await createCommentApi(commentContent, post._id);
    if (response.message == 'success') {
      setComments(response.comments);
      setCommentContent('');
    }
    setLoading(false);
  }

  async function updateComment(e) {
    e.preventDefault();
    
    if (!requireLogin()) return;
    
    setLoading(true);
    const response = await updateCommentApi(post._id, editingCommentId, commentContent);
    
    if (response.message == 'success') {
      // Refresh comments after update
      const updatedComments = await getPostComments(post._id);
      if (updatedComments.message == 'success') {
        setComments(updatedComments.comments);
      }
      // Reset form
      setCommentContent('');
      setIsUpdatingComment(false);
      setEditingCommentId(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    // Reverse comments on initial load
    if (comments.length > 0) {
      let newComments = structuredClone(comments);
      newComments.reverse();
      setComments(newComments);
    }
  }, [post._id])

  function setFormUpdate(content, commentId) {
    setCommentContent(content);
    setIsUpdatingComment(true);
    setEditingCommentId(commentId);
  }

  function cancelUpdate() {
    setCommentContent('');
    setIsUpdatingComment(false);
    setEditingCommentId(null);
  }

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  async function refreshComments() {
    const updatedComments = await getPostComments(post._id);
    if (updatedComments.message == 'success') {
      setComments(updatedComments.comments);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md w-full relative">
      {isDeletingPost && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex justify-center items-center rounded-lg">
          <Spinner size="lg" color="primary" />
        </div>
      )}
      
      {/* Post Header - User info and menu */}
      <PostHeader post={post} postId={post._id} getTimeAgo={getTimeAgo} userId={post.user._id} callback={callback} setIsDeletingPost={setIsDeletingPost}/>
      
      {/* Post Body - Text and image content */}
      <Link to={`/single-post/${post._id}`}>
        <PostBody post={post} postId={post._id} />
      </Link>

      {/* Comment Input Form */}
      <form onSubmit={isUpdatingComment ? updateComment : createComment} className="px-4 pb-3">
        {isUpdatingComment && (
          <div className="mb-2 text-sm text-blue-600 flex items-center justify-between">
            <span>Editing comment</span>
            <button 
              type="button" 
              onClick={cancelUpdate}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input 
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={commentContent} 
            onChange={(e) => setCommentContent(e.target.value)} 
            placeholder="Add comment ....."
            disabled={loading}
          />
          <button  
            disabled={commentContent.length < 3 || loading}
            type="submit"
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              commentContent.length < 3
                ? 'bg-blue-300 text-blue-100 cursor-not-allowed' 
                : loading
                ? 'bg-red-500 text-white hover:bg-red-600'
                : isUpdatingComment
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {loading ? (isUpdatingComment ? 'Updating...' : 'Posting...') : (isUpdatingComment ? 'Update' : 'Comment')}
          </button>
        </div>
      </form>
      
      {/* Post Actions - Like, Comment, Share buttons */}
      <PostActions 
        post={post}
        postId={post._id}
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
      />
      
      {/* Comments Section */}
      <PostComments 
        setFormUpdate={setFormUpdate}
        post={{ ...post, comments }} 
        postId={post._id} 
        getTimeAgo={getTimeAgo}
        commentsLimit={commentsLimit}
        callback={refreshComments}
      />
    </div>
  );
}