const flightRepository = require('../repositories/flightRepository');
const flightProviderService = require('./flightProviderService');

const searchFlights = async (filters) => {
  return flightRepository.searchFlights(filters);
};

const syncFlights = async ({ origin, destination, date }) => {
  const flights = await flightProviderService.fetchFlights({ origin, destination, date });
  if (!flights.length) {
    return { saved: 0, flights: [] };
  }
  const saved = await flightRepository.saveFlights(flights);
  return { saved, flights };
};

module.exports = {
  searchFlights,
  syncFlights
};
