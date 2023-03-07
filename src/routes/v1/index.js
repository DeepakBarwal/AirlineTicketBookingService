const express = require("express");
const router = express.Router();

const { BookingController } =  require("../../controllers/index");
// const { createChannel } = require("../../utils/message-queue");

// const channel = await createChannel();
const bookingController = new BookingController();

router.post('/booking', bookingController.create);
router.post('/publish', bookingController.sendMessageToQueue);

module.exports = router;