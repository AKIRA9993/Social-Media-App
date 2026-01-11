import React, { useState, useRef } from 'react'
import { Button } from '@heroui/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserProfile, getUserPosts, uploadProfilePhoto } from '../Services/ProfileService'

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const profilePhotoInputRef = useRef(null)
  const coverPhotoInputRef = useRef(null)
  const [isUploadingProfilePhoto, setIsUploadingProfilePhoto] = useState(false)
  const [isUploadingCoverPhoto, setIsUploadingCoverPhoto] = useState(false)

  // Fetch user profile data using TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  })

  // Fetch user's posts
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts'],
    queryFn: () => getUserPosts(10),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 5 * 60 * 1000,
  })

  // Mutation for uploading profile photo
  const uploadProfilePhotoMutation = useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile'])
      setIsUploadingProfilePhoto(false)
    },
    onError: (error) => {
      console.error('Error uploading profile photo:', error)
      alert('Failed to upload profile photo. Please try again.')
      setIsUploadingProfilePhoto(false)
    }
  })

  // Mutation for uploading cover photo (uses same endpoint)
  const uploadCoverPhotoMutation = useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile'])
      setIsUploadingCoverPhoto(false)
    },
    onError: (error) => {
      console.error('Error uploading cover photo:', error)
      alert('Failed to upload cover photo. Please try again.')
      setIsUploadingCoverPhoto(false)
    }
  })

  // Handle profile photo file selection
  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      setIsUploadingProfilePhoto(true)
      uploadProfilePhotoMutation.mutate(file)
    }
  }

  // Handle cover photo file selection
  const handleCoverPhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      setIsUploadingCoverPhoto(true)
      uploadCoverPhotoMutation.mutate(file)
    }
  }

  // Trigger file inputs
  const handleEditProfilePhotoClick = () => {
    profilePhotoInputRef.current?.click()
  }

  const handleEditCoverPhotoClick = () => {
    coverPhotoInputRef.current?.click()
  }

  // Extract user data from response
  const user = data?.data?.user
  const userPosts = postsData?.data?.posts || []

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-red-50 rounded-lg shadow-md p-8 text-center max-w-md">
          <p className="text-red-600 mb-4">Error loading profile: {error.message}</p>
          <Button color="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // If no user data
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-gray-600">No profile data available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={profilePhotoInputRef}
        onChange={handleProfilePhotoChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={coverPhotoInputRef}
        onChange={handleCoverPhotoChange}
        accept="image/*"
        className="hidden"
      />

      {/* Cover Image with Edit Button */}
      <div className="relative group">
        <div 
          className="h-64 bg-gradient-to-r from-blue-500 to-indigo-600"
          style={{
            backgroundImage: user.photo ? `url(${user.photo})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Edit Cover Photo Button */}
        <button
          onClick={handleEditCoverPhotoClick}
          disabled={isUploadingCoverPhoto}
          className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          {isUploadingCoverPhoto ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">Change Cover</span>
            </>
          )}
        </button>
        
        {/* Avatar - positioned to overlap cover with edit button */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative group/avatar">
            <img 
              src={user.photo || ''} 
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            {/* Edit Profile Photo Overlay */}
            <button
              onClick={handleEditProfilePhotoClick}
              disabled={isUploadingProfilePhoto}
              className="absolute inset-0 w-32 h-32 rounded-full bg-black bg-opacity-0 group-hover/avatar:bg-opacity-50 transition-all flex items-center justify-center"
            >
              {isUploadingProfilePhoto ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              ) : (
                <div className="opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-white text-xs mt-1">Change</p>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-8 pt-20 pb-8">
        
        {/* Profile Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">@{user.name?.toLowerCase().replace(/\s+/g, '')}</p>
          </div>
          <Button color="primary" size="lg">
            Edit Profile
          </Button>
        </div>

        {/* Bio - if available */}
        {user.bio && (
          <p className="text-gray-700 mb-6 text-lg">
            {user.bio}
          </p>
        )}

        {/* Stats - using real data if available */}
        <div className="flex gap-8 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{userPosts?.length || 0}</p>
            <p className="text-gray-600">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-gray-600">Following</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">About</h2>
          <div className="space-y-3">
            {user.email && (
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{user.email}</span>
              </div>
            )}
            {user.dateOfBirth && (
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Born {new Date(user.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
            {user.createdAt && (
              <div className="flex items-center gap-3 text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Section - User's Posts with Full Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Posts</h2>
            {postsLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Refreshing...</span>
              </div>
            )}
          </div>
          {postsLoading && !userPosts.length ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : userPosts && userPosts.length > 0 ? (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <div key={post._id} className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.photo || 'https://i.pravatar.cc/150?img=12'} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post Body - Full Content */}
                  <div className="mb-4">
                    <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                      {post.body}
                    </p>
                  </div>

                  {/* Post Image if available */}
                  {post.image && (
                    <div className="mb-4">
                      <img 
                        src={post.image} 
                        alt="Post content" 
                        className="w-full rounded-lg object-cover max-h-96"
                      />
                    </div>
                  )}

                  {/* Post Stats & Actions */}
                  <div className="flex items-center gap-6 pt-4 border-t border-blue-100">
                    {/* Comments */}
                    <div className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-sm font-medium">
                        {post.comments?.length || 0}
                      </span>
                    </div>

                    {/* Likes */}
                    <div className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm font-medium">
                        {post.likes || 0}
                      </span>
                    </div>

                    {/* Share */}
                    <div className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors cursor-pointer ml-auto">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="text-sm font-medium">Share</span>
                    </div>
                  </div>

                  {/* Display Comments if available */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-blue-100">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Recent Comments:
                      </p>
                      <div className="space-y-3">
                        {post.comments.slice(0, 2).map((comment, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center">
                                <span className="text-xs font-semibold text-blue-700">
                                  {comment.commentCreator?.name?.[0] || 'U'}
                                </span>
                              </div>
                              <span className="text-xs font-medium text-gray-700">
                                {comment.commentCreator?.name || 'Anonymous'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 ml-8">
                              {comment.content}
                            </p>
                          </div>
                        ))}
                        {post.comments.length > 2 && (
                          <p className="text-xs text-gray-500 ml-8">
                            + {post.comments.length - 2} more comment{post.comments.length - 2 !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p className="text-lg font-medium mb-1">No posts yet</p>
              <p className="text-sm">Share your first post to get started!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}