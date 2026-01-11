import { useState, useEffect } from "react";
import { getPosts } from "../Services/PostService";
import PostCard from "../Pages/Post/PostCard";
import PostForm from "./Post/PostForm";
import { useQuery } from "@tanstack/react-query";

export default function FeedPage() {
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),  // ✅ CHANGED: Added arrow function with parentheses
  });

  // Extract posts from the nested data structure
  const posts = data?.data?.posts || [];

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <PostForm getAllPosts={refetch} />
      
      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading posts...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 rounded-lg shadow-md p-8 text-center">
          <p className="text-red-600">Error loading posts: {error.message}</p>
        </div>
      ) : (
        <div className="w-full max-w-xl mx-auto space-y-6">
          {/* No posts message */}
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No posts available</p>
            </div>
          ) : (
            /* Map through posts from API */
            posts.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                commentsLimit={1} 
                callback={refetch} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
