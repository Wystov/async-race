// eslint-disable-next-line prettier/prettier
import type { Car, CarParams, CarsResponse, Engine, SortBy, SortOrder, WinnersResponse, Winner } from '../../utils/types';

export class APIHandler {
  private static readonly baseUrl = 'http://127.0.0.1:3000';

  public static async getCars(page: number): Promise<CarsResponse> {
    const request = await fetch(`${this.baseUrl}/garage?_page=${page}&_limit=7`);
    const cars: Car[] = await request.json();
    const totalCount = request.headers.get('X-Total-Count');
    if (totalCount === null) throw new Error("can't get cars amount");
    return { cars, totalCount: +totalCount };
  }

  public static async getCar(id: number): Promise<Car> {
    const request = await fetch(`${this.baseUrl}/garage/${id}`);
    const car = await request.json();
    return car;
  }

  public static async createCar(car: Car): Promise<Car> {
    const request = await fetch(`${this.baseUrl}/garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car),
    });
    const response = await request.json();
    return response;
  }

  public static async deleteCar(id: number): Promise<Response | undefined> {
    try {
      const response = await fetch(`${this.baseUrl}/garage/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (err) {
      console.warn(err);
      return undefined;
    }
  }

  public static async updateCar(id: number, car: Car): Promise<boolean> {
    const request = await fetch(`${this.baseUrl}/garage/${id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(car),
    });
    return request.ok;
  }

  public static async toggleEngine(id: number, status: Engine): Promise<CarParams> {
    const queryParams = `?id=${id}&status=${status}`;
    const request = await fetch(`${this.baseUrl}/engine/${queryParams}`, {
      method: 'PATCH',
    });
    const carParams: CarParams = await request.json();
    return carParams;
  }

  public static async driveMode(id: number): Promise<string | Response | undefined> {
    try {
      const queryParams = `?id=${id}&status=drive`;
      const response = await fetch(`${this.baseUrl}/engine/${queryParams}`, {
        method: 'PATCH',
      });
      if (response.ok) return 'success';
      if (response.status === 404) {
        throw new Error('404');
      }
      return response;
    } catch {
      console.log('catching stale engine break');
      return undefined;
    }
  }

  public static async getWinners(
    page: number,
    sort: SortBy,
    order: SortOrder
  ): Promise<WinnersResponse> {
    const request = await fetch(
      `${this.baseUrl}/winners?_page=${page}&_limit=10&_sort=${sort}&_order=${order}`
    );
    const winners: Winner[] = await request.json();
    const totalCount = request.headers.get('X-Total-Count');
    if (totalCount === null) throw new Error("can't get winners amount");
    return { winners, totalCount: +totalCount };
  }

  public static async getWinner(id: number): Promise<Winner | null> {
    const request = await fetch(`${this.baseUrl}/winners/${id}`);
    if (!request.ok) return null;
    const response: Winner = await request.json();
    return response;
  }

  public static async createWinner(winner: Winner): Promise<void> {
    await fetch(`${this.baseUrl}/winners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winner),
    });
  }

  public static async deleteWinner(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/winners/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('This car never won, no need to delete it from winners db');
    } catch (err) {
      console.warn((err as Error).message);
    }
  }

  public static async updateWinner(id: number, newResult: Omit<Winner, 'id'>): Promise<void> {
    await fetch(`${this.baseUrl}/winners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newResult),
    });
  }
}
