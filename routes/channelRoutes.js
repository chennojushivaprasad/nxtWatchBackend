import express from "express"
const router = express();

import {createChannel,getChannelById,getChannels,updateChannel,deleteChannel} from '../controllers/channelController.js';

router.post('/create-channel', createChannel);

router.get('/', getChannels);

router.get('/:channelId', getChannelById);

router.put('/:channelId', updateChannel);

router.delete('/:channelId', deleteChannel);

export default router
