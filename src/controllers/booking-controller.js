const { StatusCodes } = require("http-status-codes");

const { BookingService } = require("../services/index");
const { createChannel, publishMessage } = require("../utils/message-queue");
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

const bookingService = new BookingService();

class BookingController {

    constructor() {
        // this.channel = channel;
    }

    async sendMessageToQueue(req, res) {
        try {
            const channel = await createChannel();
            const data = { message: 'Success' };
            publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
            return res.status(200).json({
                message: 'Successfully published the event'
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async create(req, res) {
        try {
            const response = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.CREATED).json({
                data: response,
                success: true,
                message: 'Successfully completed the booking',
                err: {}
            });
        } catch (error) {
            return res.status(error.statusCode).json({
                data: {},
                success: false,
                message: error.message,
                err: error.explanation
            });
        }
    }
}

module.exports = BookingController;