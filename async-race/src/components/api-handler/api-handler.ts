import type { Car, CarParams, EngineStatus, Winner } from '../../utils/types';

export class APIHandler {
  private readonly baseUrl = 'http://127.0.0.1:3000';

  public async getCars(): Promise<Car[]> {
    const request = await fetch(`${this.baseUrl}/garage`);
    const cars = await request.json();
    return cars;
  }

  public async getCar(id: number): Promise<Car> {
    const request = await fetch(`${this.baseUrl}/garage/${id}`);
    const car = await request.json();
    return car;
  }

  public async createCar(car: Car): Promise<void> {
    await fetch(`${this.baseUrl}/garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
  }

  public async deleteCar(id: number): Promise<void> {
    await fetch(`${this.baseUrl}/garage/${id}`, { method: 'DELETE' });
  }

  public async updateCar(id: number, car: Car): Promise<void> {
    await fetch(`${this.baseUrl}/garage/${id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(car),
    });
  }

  public async toggleEngine(
    id: number,
    status: EngineStatus
  ): Promise<CarParams> {
    const queryParams = `?id=${id}&status=${status}`;
    const request = await fetch(`${this.baseUrl}/engine/${queryParams}`, {
      method: 'PATCH',
    });
    const carParams: CarParams = await request.json();
    return carParams;
  }

  public async driveMode(id: number): Promise<void> {
    const queryParams = `?id=${id}&status=drive`;
    const request = await fetch(`${this.baseUrl}/engine/${queryParams}`, {
      method: 'PATCH',
    });
    const data = await request.json();
    console.log(data);
  }

  public async getWinners(): Promise<Winner[]> {
    const request = await fetch(`${this.baseUrl}/winners`);
    const response: Winner[] = await request.json();
    return response;
  }

  public async getWinner(id: number): Promise<Winner> {
    const request = await fetch(`${this.baseUrl}/winners/${id}`);
    const response: Winner = await request.json();
    return response;
  }

  public async createWinner(winner: Winner): Promise<void> {
    await fetch(`${this.baseUrl}/winners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winner),
    });
  }

  public async deleteWinner(id: number): Promise<void> {
    await fetch(`${this.baseUrl}/winners/${id}`, { method: 'DELETE' });
  }

  public async updateWinner(
    id: number,
    newResult: Omit<Winner, 'id'>
  ): Promise<void> {
    await fetch(`${this.baseUrl}/winners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newResult),
    });
  }
}
