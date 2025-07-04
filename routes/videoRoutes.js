import express from 'express';
import {
  videoUpload,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
} from '../controllers/videoController.js';
import { authentication } from '../middleware/authentication.js';

const router = express.Router();


router.post('/', authentication, videoUpload);       
router.get('/', authentication, getVideos);          
router.get('/:id', authentication, getVideoById);   
router.put('/:id', authentication, updateVideo);
router.delete('/:id', authentication, deleteVideo);

export default router;
