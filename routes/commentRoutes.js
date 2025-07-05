import express from 'express';
import { addComment, getCommentsByVideoId } from '../controllers/commentController.js';
import { authentication } from '../middleware/authentication.js';

const router = express.Router();

router.post('/', authentication, addComment); 
router.get('/:videoId', getCommentsByVideoId); 

export default router;
