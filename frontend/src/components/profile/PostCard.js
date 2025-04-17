// src/components/profile/PostCard.js
import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { FiMoreVertical, FiHeart, FiMessageSquare, FiEye } from 'react-icons/fi';
import axios from 'axios';
import Cookies from 'js-cookie';
import CreateCommentForm from './CreateCommentForm';
import CommentList from './CommentList';
import EditPostForm from './EditPostForm';

const PostCard = ({ post, isOwnProfile, onDelete, onUpdate, cardBg, activePostId, setActivePostId }) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [likes, setLikes] = useState(post.likes_count || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [views, setViews] = useState(post.views_count || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);

  const defaultAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${post.author.username}`;
  const locale = i18n.language === 'ru' ? ru : enUS;
  const dateFormat = i18n.language === 'ru' ? 'd MMMM yyyy, HH:mm' : 'PPP p';

  useEffect(() => {
    const token = Cookies.get('token');
    axios
      .get(`http://localhost:8000/api/posts/${post.id}/like_status/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => {
        setHasLiked(response.data.has_liked);
        setLikes(post.likes_count || 0);
      })
      .catch(error => {
        console.error('Error fetching like status:', error.response || error.message);
      });

    // Запрашиваем просмотры только один раз при загрузке
    handleView();
  }, [post.id, post.likes_count]);

  const handleLike = async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.post(
        `http://localhost:8000/api/posts/${post.id}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { status } = response.data;
      setHasLiked(status === 'liked');
      setLikes(prev => (status === 'liked' ? prev + 1 : prev - 1));
    } catch (error) {
      console.error('Error liking post:', error.response || error.message);
      toast({
        title: t('posts.like_error', 'Failed to like post'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleView = async () => {
    const token = Cookies.get('token');
    try {
      const response = await axios.post(
        `http://localhost:8000/api/posts/${post.id}/view/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status === 'viewed') {
        setViews(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error recording view:', error.response || error.message);
    }
  };

  const toggleComments = () => {
    if (showComments) {
      setShowComments(false);
      setActivePostId(null);
    } else {
      setShowComments(true);
      setActivePostId(post.id);
    }
  };

  // Закрываем комментарии, если другой пост стал активным
  useEffect(() => {
    if (activePostId !== post.id && showComments) {
      setShowComments(false);
    }
  }, [activePostId, post.id]);

  return (
    <Box p={4} borderRadius="md" shadow="md" bg={cardBg}>
      {isEditing ? (
        <EditPostForm post={post} onUpdate={onUpdate} setIsEditing={setIsEditing} />
      ) : (
        <>
          <Flex justify="space-between" mb={3}>
            <HStack>
              <Image
                src={post.author.avatar || defaultAvatar}
                alt="Avatar"
                boxSize="40px"
                borderRadius="full"
              />
              <Box>
                <Text fontWeight="bold">{post.author.username}</Text>
                <Text fontSize="sm" color="gray.500">
                  {format(new Date(post.created_at), dateFormat, { locale })}
                </Text>
              </Box>
            </HStack>
            {isOwnProfile && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiMoreVertical />}
                  variant="ghost"
                  aria-label="Options"
                />
                <MenuList>
                  <MenuItem onClick={() => setIsEditing(true)}>
                    {t('posts.edit', 'Edit')}
                  </MenuItem>
                  <MenuItem onClick={() => onDelete(post.id)}>
                    {t('posts.delete', 'Delete')}
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
          <Box mb={3}>
            <Text>{post.content}</Text>
          </Box>
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <HStack>
                <IconButton
                  icon={<FiHeart />}
                  variant="ghost"
                  aria-label="Like"
                  onClick={handleLike}
                  color={hasLiked ? 'red.500' : 'gray.500'}
                />
                <Text>{likes}</Text>
              </HStack>
              <HStack>
                <IconButton
                  icon={<FiMessageSquare />}
                  variant="ghost"
                  aria-label="Comments"
                  onClick={toggleComments}
                />
                <Text>{commentsCount}</Text>
              </HStack>
            </HStack>
            <HStack>
              <FiEye />
              <Text>{views}</Text>
            </HStack>
          </Flex>
          {showComments && (
            <Box mt={4}>
              <CreateCommentForm
                postId={post.id}
                setCommentsCount={setCommentsCount}
                onCommentAdded={newComment => {
                  document.dispatchEvent(
                    new CustomEvent('newComment', {
                      detail: { postId: post.id, comment: newComment },
                    })
                  );
                }}
              />
              <CommentList postId={post.id} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PostCard;