// src/components/profile/EditPostForm.js
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Textarea,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Cookies from 'js-cookie';

const EditPostForm = ({ post, onUpdate, setIsEditing }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [content, setContent] = useState(post.content);

  const handleSubmit = async e => {
    e.preventDefault();
    const token = Cookies.get('token');
    try {
      const response = await axios.put(
        `http://localhost:8000/api/posts/${post.id}/`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(post.id, response.data);
      setIsEditing(false);
      toast({
        title: t('posts.updated', 'Post updated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating post:', error.response || error.message);
      toast({
        title: t('posts.error', 'Failed to update post'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} borderRadius="md" shadow="md" bg="transparent">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={t('posts.form.placeholder', 'Write your thoughts...')}
            />
          </FormControl>
          <HStack spacing={4}>
            <Button type="submit" colorScheme="blue">
              {t('posts.form.submit_edit', 'Save')}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              {t('posts.form.cancel', 'Cancel')}
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default EditPostForm;