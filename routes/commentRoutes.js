import express from 'express';
import { addComment, getCommentsByVideoId, updateComment , deleteComment} from '../controllers/commentController.js';
import { authentication } from '../middleware/authentication.js';

const router = express.Router();

router.post('/', authentication, addComment); 
router.get('/:videoId', getCommentsByVideoId); 
router.put("/:commentId", authentication, updateComment);
router.delete("/:commentId", authentication, deleteComment);

export default router;
