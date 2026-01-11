import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { deleteComment as deleteCommentApi } from "../../Services/CommentService";

export default function PostComments({ post, getTimeAgo, commentsLimit = 3, callback, setFormUpdate }) {
  const { userData } = useContext(AuthContext);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [comments, setComments] = useState(post.comments || []);

  // Sync comments with post.comments (which are already reversed in PostCard)
  useEffect(() => {
    setComments(post.comments || []);
  }, [post._id, post.comments]);

  // Don't render if no comments
  if (!comments || comments.length === 0) {
    return null;
  }

  // Show comments based on limit
  const displayedComments = comments.slice(0, commentsLimit);

  // Default avatar placeholder - more reliable URL
  const defaultAvatar = "https://i.pinimg.com/736x/cc/2e/75/cc2e750cdf2406ea11993447a4d864f9.jpg";

  // Delete comment function
  async function deleteComment(commentId) {
    setDeletingCommentId(commentId);
    const response = await deleteCommentApi(post._id, commentId);
    
    if (response.message === 'success') {
      // Remove the deleted comment from local state
      setComments(comments.filter(comment => comment._id !== commentId));
      // Refresh from server to ensure consistency
      await callback();
    } else {
      alert('Unable to delete comment. Please try again.');
    }
    
    setDeletingCommentId(null);
  }

  return (
    <div className="px-4 py-3 space-y-3 border-t border-gray-200">
      
      {/* Map through comments */}
      {displayedComments.map((comment) => (
        <div key={comment._id} className="flex gap-2">
          
          {/* Commenter avatar */}
          <img 
            src={comment.commentCreator?.photo || defaultAvatar}
            alt={comment.commentCreator?.name || "User"}
            className="w-8 h-8 rounded-full object-cover shrink-0"
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />
          
          <div className="flex-1">
            {/* Comment bubble */}
            <div className="bg-gray-100 rounded-2xl px-3 py-2">
              <p className="font-semibold text-sm">
                {comment.commentCreator?.name || "Anonymous"}
              </p>
              <p className="text-sm">{comment.content}</p>
            </div>
            
            {/* Comment actions - like, reply, time, edit, delete */}
            <div className="flex items-center gap-2 px-3 mt-1 text-xs text-gray-500">
              <button 
                className="hover:underline font-semibold"
              >
                Like
              </button>
              <span>·</span>
              <button 
                className="hover:underline font-semibold"
              >
                Reply
              </button>
              <span>·</span>
              <span>{getTimeAgo(comment.createdAt)}</span>
              
              {/* Show edit and delete buttons only for comment owner */}
              {userData?._id === comment.commentCreator?._id && (
                <>
                  <span>·</span>
                  <button 
                    onClick={() => setFormUpdate(comment.content, comment._id)}
                    className="hover:underline font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <span>·</span>
                  <button 
                    className="hover:underline font-semibold text-red-600 hover:text-red-700"
                    onClick={() => deleteComment(comment._id)}
                    disabled={deletingCommentId === comment._id}
                  >
                    {deletingCommentId === comment._id ? "Deleting..." : "Delete"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Show more comments button if there are more than the limit */}
      {post.comments.length > commentsLimit && (
        <button
          className="text-sm text-gray-600 hover:underline px-2"
          onClick={() => console.log('View all comments clicked, total:', post.comments.length)}
        >
          View all {post.comments.length} comments
        </button>
      )}

    </div>
  );
}