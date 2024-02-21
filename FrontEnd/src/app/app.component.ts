import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/game.service ';
import { Card } from 'src/models/card.model';
import { timer } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Card Game';

  cardNames = ['AC','2C',  '3C', '4C', '5C',  '6C',  '7C',  '8C',  '9C',  '10C'];
  cards: Card[] = [];

  currentPlayer: number = 1;
  player1Score: number = 0;
  player2Score: number = 0;

  selectedCards: Card[] = [];

  constructor(public gameService: GameService) { }

  ngOnInit() {
    //this.gameService.getGameState().subscribe();
  }

  startGame() {
    this.gameService.startGame().subscribe(
      response => {
        this.initializeCards(response);
      },
      error => {
        console.error('There was an error during the start game service:', error);
      }
    );
  }

  initializeCards(response: any) {

    this.cards = Object.values(response.cards).map((card: any, index: number) => ({
      key: index,
      value: card.value,
      image: `assets/${this.cardNames[card.value - 1]}.png`,
      isFlipped: card.isFlipped,
      isMatched: card.isMatched
    }));
    this.player1Score = response.scores[0];
    this.player2Score = response.scores[1];
    this.currentPlayer = response.currentPlayer;
  }

  takeTurn(card: Card) {
    card.isFlipped = true;
    this.selectedCards.push(card);
    
    if (this.selectedCards.length === 2) {

      this.gameService.takeTurn(this.selectedCards[0].key, this.selectedCards[1].key).subscribe(
        response => {
          this.selectedCards = [];
          timer(1000) 
            .pipe(
              delay(0) // This ensures the timer starts immediately
            )
            .subscribe(() => {
              this.initializeCards(response);
            });
        },
        error => {
          console.error('There was an error during the take turn service:', error);
        }
      );
    }
  }

  getGameState() {
    this.gameService.getGameState().subscribe(
      response => {
        this.initializeCards(response);
      },
      error => {
        console.error('There was an error during the get game state service:', error);
      }
    );
  }

  resetGame() {
    this.gameService.resetGame().subscribe(
      response => {
        this.initializeCards(response);
      },
      error => {
        console.error('There was an error during the reset game service:', error);
      }
    );
  }

}
