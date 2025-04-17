// src/components/profile/CommentList.js
import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  useToast,
  useColorModeValue,
  HStack,
  Select,
  Button,
  Image,
  IconButton,
  Textarea,
  FormControl,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { FiHeart, FiCornerUpLeft } from 'react-icons/fi';
import axios from 'axios';
import Cookies from 'js-cookie';

const CommentList = ({ postId }) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [sortOrder, setSortOrder] = useState('popularity_score'); // По умолчанию: популярные
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const cardBg = useColorModeValue('gray.50', 'gray.600');
  const replyBg = useColorModeValue('gray.100', 'gray.800');

  const locale = i18n.language === 'ru' ? ru : enUS;
  const dateFormat = i18n.language === 'ru' ? 'd MMMM yyyy, HH:mm' : 'PPP p';

  const fetchComments = async (url = null) => {
    const token = Cookies.get('token');
    setIsLoading(true);
    try {
      const response = await axios.get(
        url || `http://localhost:8000/api/comments/?post=${postId}&ordering=${sortOrder}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newComments = response.data.results || response.data;
      setComments(prev => (url ? [...prev, ...newComments] : newComments));
      setNextPage(response.data.next);
    } catch (error) {
      console.error('Error fetching comments:', error.response || error.message);
      toast({
        title: t('comments.error', 'Failed to load comments'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    const handleNewComment = event => {
      if (event.detail.postId === postId) {
        setComments([]);
        fetchComments();
      }
    };
    document.addEventListener('newComment', handleNewComment);
    return () => document.removeEventListener('newComment', handleNewComment);
  }, [postId, sortOrder, toast, t]);

  const handleSortChange = e => {
    setSortOrder(e.target.value);
    setComments([]);
    setNextPage(null);
  };

  const loadMore = () => {
    if (nextPage) {
      fetchComments(nextPage);
    }
  };

  const handleReply = async commentId => {
    const token = Cookies.get('token');
    try {
      const response = await axios.post(
        `http://localhost:8000/api/comments/`,
        { post: postId, text: replyContent, parent: commentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyContent('');
      setReplyTo(null);
      document.dispatchEvent(
        new CustomEvent('newComment', {
          detail: { postId, comment: response.data },
        })
      );
      toast({
        title: t('comments.created', 'Comment added'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating reply:', error.response || error.message);
      toast({
        title: t('comments.error', 'Failed to add comment'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLikeComment = async commentId => {
    const token = Cookies.get('token');
    try {
      const response = await axios.post(
        `http://localhost:8000/api/comments/${commentId}/like/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { status } = response.data;
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                has_liked: status === 'liked',
                likes_count: status === 'liked' ? comment.likes_count + 1 : comment.likes_count - 1,
              }
            : comment
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error.response || error.message);
      toast({
        title: t('comments.like_error', 'Failed to like comment'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading && comments.length === 0) return <Text>{t('loader.loading', 'Loading...')}</Text>;

  const renderComments = (parentId = null, marginLeft = 0) => {
    return comments
      .filter(comment => (comment.parent || null) === parentId)
      .map(comment => (
        <><Box
          key={comment.id}
          p={3}
          borderRadius="md"
          bg={comment.parent ? replyBg : cardBg}
          ml={marginLeft}
        >
          <VStack spacing={3} alignItems={'start'} w={'100%'}>
            <HStack alignItems={'center'}>
              <Image
                src={comment.author.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${comment.author.username}`}
                alt="Avatar"
                boxSize="40px"
                borderRadius="full"
              />
              <Box>
                <VStack alignItems={'start'} spacing={0}>
                  <Text fontWeight="bold">{comment.author.username}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {format(new Date(comment.created_at), dateFormat, { locale })}
                  </Text>
                </VStack>
              </Box>
            </HStack>
            <Box flex="1">
              <Text>{comment.text}</Text>
            </Box>
            <Box w={'100%'}>
              <HStack mt={2} spacing={4} w={'100%'}>
                  <HStack>
                    <IconButton
                      icon={<FiHeart />}
                      variant="ghost"
                      aria-label="Like"
                      onClick={() => handleLikeComment(comment.id)}
                      color={comment.has_liked ? 'red.500' : 'gray.500'}
                    />
                    <Text>{comment.likes_count}</Text>
                  </HStack>
                  <Button
                    leftIcon={<FiCornerUpLeft />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(comment.id)}
                  >
                    {t('comments.reply', 'Reply')}
                  </Button>
                </HStack>
                {replyTo === comment.id && (
                  <Box mt={2} w={'100%'}>
                    <FormControl>
                      <Textarea
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        placeholder={t('comments.reply_placeholder', 'Write your reply...')}
                      />
                    </FormControl>
                    <HStack mt={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleReply(comment.id)}
                      >
                        {t('comments.submit_reply', 'Send Reply')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReplyTo(null)}
                      >
                        {t('posts.form.cancel', 'Cancel')}
                      </Button>
                    </HStack>
                  </Box>
                )}
            </Box>
          </VStack>
        </Box>
        {renderComments(comment.id, marginLeft + 4)}</>
      ));
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text fontWeight="bold">{t('comments.header', 'Comments')}</Text>
        <Select
          value={sortOrder}
          onChange={handleSortChange}
          width="200px"
        >
          <option value="popularity_score">{t('comments.sort.popular', 'Most popular')}</option>
          <option value="-created_at">{t('comments.sort.newest', 'Newest first')}</option>
          <option value="created_at">{t('comments.sort.oldest', 'Oldest first')}</option>
        </Select>
      </HStack>
      {comments.length === 0 ? (
        <Text>{t('comments.empty', 'No comments yet')}</Text>
      ) : (
        renderComments()
      )}
      {nextPage && (
        <Button onClick={loadMore} colorScheme="blue" size="sm" mt={2}>
          {t('comments.load_more', 'Load more')}
        </Button>
      )}
    </VStack>
  );
};

export default CommentList;