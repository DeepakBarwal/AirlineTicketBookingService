const axios = require("axios");

const { BookingRepository } = require("../repositories/index");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const { ServiceError } = require("../utils/errors");

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        try {
            const flightId = data.flightId;
            const getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
            const response = await axios.get(getFlightRequestUrl);
            const flightData = response.data.data;
            let priceOfFlight = flightData.price;
            if (data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError(
                    'Something went wrong in the booking process',
                    'Insufficient seats in the flight'
                );
            }
            const totalCost = priceOfFlight * data.noOfSeats;
            const bookingPayload = { ...data, totalCost };
            const booking = await this.bookingRepository.create(bookingPayload);
            const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${booking.flightId}`;
            await axios.patch(updateFlightRequestUrl, {
                totalSeats: flightData.totalSeats - booking.noOfSeats
            });
            const finalBooking = await this.bookingRepository.update(booking.id, { status: 'BOOKED' });
            return finalBooking;
        } catch (error) {
            if (error.name === 'RepositoryError' || error.name === 'ValidationError') {
                throw error;
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService;