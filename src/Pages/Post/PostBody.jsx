export default function PostBody({ post }) {
  return (
    <>
      {/* POST CONTENT - Main text */}
      <div className="px-4 pb-3">
        <p className="text-sm whitespace-pre-wrap">{post.body}</p>
      </div>

      {/* Post image if exists */}
      {post.image && (
        <div className="pb-3">
          <img 
            src={post.image} 
            alt="Post content" 
            className="w-full object-cover max-h-96"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
    </>
  );
}