// src/components/profile/CreatePostForm.js
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

const CreatePostForm = ({ setPosts }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [content, setContent] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const token = Cookies.get('token');
    try {
      const response = await axios.post(
        'http://localhost:8000/api/posts/',
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(prev => [response.data, ...prev]);
      setContent('');
      toast({
        title: t('posts.created', 'Post created'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating post:', error.response || error.message);
      toast({
        title: t('posts.error', 'Failed to create post'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} borderRadius="md" shadow="md" bg="transparent">
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Textarea
            name="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t('posts.form.placeholder', 'Write your thoughts...')}
          />
        </FormControl>
        <Button mt={2} type="submit" colorScheme="blue" width="full">
          {t('posts.form.submit', 'Create Post')}
        </Button>
      </form>
    </Box>
  );
};

export default CreatePostForm;