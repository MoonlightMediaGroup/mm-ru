// src/components/profile/PostsTab.js
import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Cookies from 'js-cookie';
import CreatePostForm from './CreatePostForm';
import PostCard from './PostCard';

const PostsTab = ({ username, isOwnProfile }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePostId, setActivePostId] = useState(null); // Для открытых комментариев
  const cardBg = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoading(true);
    axios
      .get(`http://localhost:8000/api/posts/?author=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setPosts(response.data.results || response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error.response || error.message);
        toast({
          title: t('posts.error', 'Failed to load posts'),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [username, toast, t]);

  const handleDelete = async postId => {
    const token = Cookies.get('token');
    try {
      await axios.delete(`http://localhost:8000/api/posts/${postId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter(post => post.id !== postId));
      toast({
        title: t('posts.deleted', 'Post deleted'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting post:', error.response || error.message);
      toast({
        title: t('posts.error', 'Failed to delete post'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = (postId, updatedData) => {
    setPosts(posts.map(post => (post.id === postId ? { ...post, ...updatedData } : post)));
  };

  if (isLoading) return <Text>{t('loader.loading', 'Loading...')}</Text>;

  return (
    <VStack spacing={4} align="stretch">
      {isOwnProfile && <CreatePostForm setPosts={setPosts} />}
      {posts.length === 0 ? (
        <Text>{t('posts.empty', 'No posts yet')}</Text>
      ) : (
        posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            isOwnProfile={isOwnProfile}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            cardBg={cardBg}
            activePostId={activePostId}
            setActivePostId={setActivePostId}
          />
        ))
      )}
    </VStack>
  );
};

export default PostsTab;