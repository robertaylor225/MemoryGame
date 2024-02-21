import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from './environments/environment';
import { Card } from './models/card.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = environment.baseUrl;

  cards: Card[] = [];
  currentPlayer: number = 1;
  player1Score: number = 0;
  player2Score: number = 0;

  selectedCards: Card[] = [];

  constructor(private http: HttpClient) { }

  startGame(): Observable<any> {
    return this.http.post(`${this.apiUrl}/start`, {});
  }

  takeTurn(card1: number, card2: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/turn`, { card1, card2 });
  }

  getGameState(): Observable<any> {
    return this.http.get(`${this.apiUrl}/state`);
  }

  resetGame(): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset`, {});
  }

  selectCard(card: Card) {
    this.selectedCards.push(card);

    if (this.selectedCards.length === 2) {
      this.takeTurn(this.selectedCards[0].value, this.selectedCards[1].value).subscribe(() => {
        // TODO: Handle the response of the take turn service
      });
      this.selectedCards = [];
    }
  }
}
