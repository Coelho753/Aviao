const env = require('../config/env');

const fetch = global.fetch || ((...args) => import('node-fetch').then(({ default: fetchFn }) => fetchFn(...args)));

const generateMockFlights = ({ origin, destination, date }) => {
  return [
    {
      airline: 'GOL',
      price: 780,
      origin,
      destination,
      date,
      departureTime: '08:00',
      arrivalTime: '10:40',
      duration: '2h40m'
    },
    {
      airline: 'LATAM',
      price: 920,
      origin,
      destination,
      date,
      departureTime: '14:30',
      arrivalTime: '17:20',
      duration: '2h50m'
    },
    {
      airline: 'AZUL',
      price: 850,
      origin,
      destination,
      date,
      departureTime: '18:10',
      arrivalTime: '20:55',
      duration: '2h45m'
    }
  ];
};

const getAccessToken = async () => {
  const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.amadeusClientId,
      client_secret: env.amadeusClientSecret
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao autenticar com Amadeus: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
};

const mapAmadeusFlights = (offers) => {
  if (!Array.isArray(offers)) {
    return [];
  }

  return offers.map((offer) => {
    const itinerary = offer.itineraries?.[0];
    const segment = itinerary?.segments?.[0];
    const departure = segment?.departure?.at ? new Date(segment.departure.at) : null;
    const arrival = segment?.arrival?.at ? new Date(segment.arrival.at) : null;

    return {
      airline: offer.validatingAirlineCodes?.[0] || 'N/A',
      price: Number(offer.price?.total || 0),
      origin: segment?.departure?.iataCode || 'N/A',
      destination: segment?.arrival?.iataCode || 'N/A',
      date: departure ? departure.toISOString().slice(0, 10) : null,
      departureTime: departure ? departure.toISOString().slice(11, 16) : '00:00',
      arrivalTime: arrival ? arrival.toISOString().slice(11, 16) : '00:00',
      duration: itinerary?.duration?.replace('PT', '') || 'N/A'
    };
  });
};

const fetchFromAmadeus = async ({ origin, destination, date }) => {
  const token = await getAccessToken();
  const url = new URL('https://test.api.amadeus.com/v2/shopping/flight-offers');
  url.searchParams.append('originLocationCode', origin);
  url.searchParams.append('destinationLocationCode', destination);
  url.searchParams.append('departureDate', date);
  url.searchParams.append('adults', '1');
  url.searchParams.append('currencyCode', 'BRL');
  url.searchParams.append('max', '10');

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao consultar Amadeus: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return mapAmadeusFlights(data.data);
};

const fetchFlights = async ({ origin, destination, date }) => {
  if (env.useMockProvider || !env.amadeusClientId || !env.amadeusClientSecret) {
    return generateMockFlights({ origin, destination, date });
  }

  return fetchFromAmadeus({ origin, destination, date });
};

module.exports = {
  fetchFlights
};
