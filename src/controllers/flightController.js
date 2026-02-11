const flightService = require('../services/flightService');
const env = require('../config/env');
const airports = require('../config/airports');

const searchFlights = async (req, res) => {
  try {
    const { origin, destination, date, maxPrice } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({
        message: 'Parâmetros obrigatórios: origin, destination, date.'
      });
    }

    const filters = {
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      date,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    };

    const flights = await flightService.searchFlights(filters);

    const response = flights.map((flight) => ({
      airline: flight.airline,
      price: Number(flight.price),
      origin: flight.origin,
      destination: flight.destination,
      date: flight.date,
      departureTime: flight.departure_time,
      arrivalTime: flight.arrival_time,
      duration: flight.duration,
      bookingProvider: flight.booking_provider,
      purchaseUrl: flight.purchase_url
    }));

    return res.json(response);
  } catch (error) {
    console.error('[flightController] Erro ao buscar voos', error);
    return res.status(500).json({ message: 'Erro interno ao buscar voos.' });
  }
};

module.exports = {
  searchFlights,
  listAirports: (_req, res) => {
    return res.json(airports);
  },
  getSearchConfig: (_req, res) => {
    return res.json({
      syncDaysAhead: env.syncDaysAhead,
      airports
    });
  }
};
