import { Button, Textarea } from '@heroui/react'
import React, { useState } from 'react'
import { CreatePostApi } from '../../Services/PostService';
import { useAuthRedirect } from '../../Hooks/useAuthRedirect';
import staticTry from "../../assets/1.jpg";

export default function PostForm({ getAllPosts }) {
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState("");
  const [imageUrl, setImageUrl] = useState('');
  
  // Get the auth redirect hook
  const requireLogin = useAuthRedirect();

  function handleImage(e) {
    setImage(e?.target.files[0]);
    setImageName(e?.target.files[0].name);
    setImageUrl(e && URL.createObjectURL(e.target.files[0]));
    
    if (e) {
      e.target.value = "";
    }
  }

  function clearImage() {
    setImage(null);
    setImageName('');
    setImageUrl('');
  }

  async function createPost(e) {
    e.preventDefault();
    
    // Check if user is logged in before creating post
    if (!requireLogin()) return;
    
    setLoading(true);
    
    const formData = new FormData();
    body && formData.append('body', body);
    image && formData.append('image', image);
    
    const response = await CreatePostApi(formData);
    
    if (response.message == 'success') {
      setBody('');
      setImage(null);
      setImageName('');
      setImageUrl('');
      await getAllPosts();
    }
    
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-xl mx-auto mb-6">
      <form onSubmit={createPost} className="p-4">
        {/* Text input area */}
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          minRows={3}
          placeholder="What's on your mind?"
          classNames={{
            input: "resize-y",
            inputWrapper: "shadow-sm",
          }}
        />
        
        {/* Image preview with close button */}
        {imageUrl && (
          <div className="mt-3 relative">
            {/* Close button */}
            <svg
              className='size-6 absolute top-4 end-4 cursor-pointer hover:opacity-70 transition-opacity'
              onClick={clearImage}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
            
            {/* Image display */}
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full rounded-md"
            />
          </div>
        )}
        
        {/* Form footer with image upload and post button */}
        <div className="flex mt-3 justify-between items-center">
          {/* Image upload button */}
          <label className="flex items-center gap-2 px-4 py-2 text-blue-700 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <span className="text-sm font-medium">Add Image</span>
            <input
              onChange={handleImage}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
          
          {/* Post button - disabled if no content */}
          <Button 
            disabled={!(body || image)} 
            isLoading={loading} 
            color="primary" 
            type="submit"
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}