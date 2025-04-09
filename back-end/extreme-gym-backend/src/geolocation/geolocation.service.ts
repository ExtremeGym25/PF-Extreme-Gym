import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Client, GeocodeRequest } from '@googlemaps/google-maps-services-js';

@Injectable()
export class GeolocationService {
  private readonly client: Client;
  private readonly apiKey: string;

  constructor() {
    this.client = new Client({});
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException('API_KEY Google no esta definida en .env');
    }
    this.apiKey = apiKey;
  }

  async geocodeAddress(
    address: string,
  ): Promise<{ lat: number; lng: number } | null> {
    const request: GeocodeRequest = {
      params: {
        address: address,
        key: this.apiKey,
      },
    };

    try {
      const result = await this.client.geocode(request);
      if (result.data.results.length > 0) {
        const location = result.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }
      return null;
    } catch (error) {
      console.error('Error al geocodificar la dirección:', error);
      return null;
    }
  }
}
