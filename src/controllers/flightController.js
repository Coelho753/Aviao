const flightService = require('../services/flightService');

const searchFlights = async (req, res) => {
  try {
    const { origin, destination, date, maxPrice } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({
        message: 'Parâmetros obrigatórios: origin, destination, date.'
      });
    }

    const filters = {
      origin,
      destination,
      date,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    };

    const flights = await flightService.searchFlights(filters);

    const response = flights.map((flight) => ({
      airline: flight.airline,
      price: Number(flight.price),
      departureTime: flight.departure_time,
      arrivalTime: flight.arrival_time,
      duration: flight.duration
    }));

    return res.json(response);
  } catch (error) {
    console.error('[flightController] Erro ao buscar voos', error);
    return res.status(500).json({ message: 'Erro interno ao buscar voos.' });
  }
};

module.exports = {
  searchFlights
};
