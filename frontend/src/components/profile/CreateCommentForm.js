// src/components/profile/CreateCommentForm.js
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Cookies from 'js-cookie';

const CreateCommentForm = ({ postId, setCommentsCount, onCommentAdded }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [content, setContent] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const token = Cookies.get('token');
    try {
      const response = await axios.post(
        `http://localhost:8000/api/comments/`,
        { post: postId, text: content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      setCommentsCount(prev => prev + 1);
      onCommentAdded(response.data);
      toast({
        title: t('comments.created', 'Comment added'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating comment:', error.response || error.message);
      toast({
        title: t('comments.error', 'Failed to add comment'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box mb={4}>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t('comments.placeholder', 'Write your thoughts...')}
          />
        </FormControl>
        <Button mt={2} type="submit" colorScheme="blue" size="sm">
          {t('comments.submit', 'Post Comment')}
        </Button>
      </form>
    </Box>
  );
};

export default CreateCommentForm;