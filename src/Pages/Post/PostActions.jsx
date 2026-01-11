import { useAuthRedirect } from "../../Hooks/useAuthRedirect";

export default function PostActions({ post, showCommentInput, setShowCommentInput }) {
  const requireLogin = useAuthRedirect();
  
  // Handle like button click
  const handleLike = () => {
    if (!requireLogin()) return;
    // Like functionality
  };

  // Handle comment button click
  const handleComment = () => {
    if (!requireLogin()) return;
    setShowCommentInput(!showCommentInput);
  };

  // Handle share button click
  const handleShare = () => {
    if (!requireLogin()) return;
    // Share functionality
  };

  return (
    <>
      {/* REACTIONS BAR - Likes and comments count */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-200">
        
        {/* Likes count */}
        <div className="flex items-center gap-1">
          <span className="text-base">👍❤️</span>
          <span>{post.likes?.length || 0}</span>
        </div>
        
        {/* Comments count */}
        <span>
          {post.comments?.length || 0} comment{post.comments?.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ACTION BUTTONS - Like, Comment, Share */}
      <div className="border-t border-gray-200 grid grid-cols-3 text-gray-600">
        
        {/* Like button */}
        <button 
          className="py-2 hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-2"
          onClick={handleLike}
        >
          <span className="text-lg">👍</span>
          Like
        </button>
        
        {/* Comment button */}
        <button 
          className="py-2 hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-2"
          onClick={handleComment}
        >
          <span className="text-lg">💬</span>
          Comment
        </button>
        
        {/* Share button */}
        <button 
          className="py-2 hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-2"
          onClick={handleShare}
        >
          <span className="text-lg">↗️</span>
          Share
        </button>
      </div>
    </>
  );
}