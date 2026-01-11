import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { deletePost as deletePostApi } from "../../Services/PostService";


export default function PostHeader({ post, getTimeAgo, postId , userId, callback, setIsDeletingPost }) {
  const {userData} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  async function deletePost(){
    setIsDeletingPost(true);
    setLoading(true);
    const response = await deletePostApi(postId);
    if (response.message == 'success') {
      await callback()
    }
    setIsDeletingPost(false);
    setLoading(false);
  }
  return <>
    {/* POST HEADER - Profile info and menu */}
    <div className="p-4 flex items-start justify-between">
      <div className="flex items-start gap-3">
        
        {/* Profile picture */}
        <img 
          src={post.user?.photo || "https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg"} 
          alt={post.user?.name || "User"}
          className="w-10 h-10 rounded-full object-cover"
        />
        
        {/* Name and time */}
        <div>
          <p className="font-semibold text-sm">
            {post.user?.name || "Anonymous User"}
          </p>
          <p className="text-gray-500 text-xs">
            {getTimeAgo(post.createdAt)}
          </p>
        </div>
      </div>
      
      {/* Three dots menu button - only show for post owner */}
      {userData?._id === post.user?._id && (
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="light" size="sm">
              <svg className="w-5 h-5 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx={5} cy={12} r={1} />
                <circle cx={12} cy={12} r={1} />
                <circle cx={19} cy={12} r={1} />
              </svg>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="edit">Update Post</DropdownItem>
            <DropdownItem onClick={deletePost} key="delete" className="text-danger" color="danger">
              Delete Post
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  </>;
}