
import express from 'express';


import {
  videoUpload,
  getVideos,
  getVideoById,
  getVideosByUser,
  updateVideo,
  deleteVideo
} from '../controllers/videoController.js';
import { authentication } from '../middleware/authentication.js';

const router = express.Router();

router.post('/', authentication, videoUpload);       
router.get('/', getVideos);          
router.get('/:id', getVideoById);    
router.put('/:id', authentication, updateVideo);
router.delete('/:id', authentication, deleteVideo);

router.get('/:userId/videos', getVideosByUser);  



export default router;
