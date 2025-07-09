import express from 'express';
import { createChannel, getChannel, getAllChannels, updateChannel, deleteChannel } from '../controllers/channelController.js';
import { authentication } from '../middleware/authentication.js';

const router = express.Router();

router.post('/', authentication, createChannel);           // Create channel
router.get('/:id', getChannel);                         // Get channel by ID
router.get('/', getAllChannels);                        // List all channels
router.put('/:id', authentication, updateChannel);         // Update channel
router.delete('/:id', authentication, deleteChannel);      // Delete channel

export default router;
