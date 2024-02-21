using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace CardGame_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameController : ControllerBase
    {
        private static GameState _gameState = new GameState();

        // Game Initialization
        [HttpPost]
        [Route("start")]
        public ActionResult StartGame()
        {
            _gameState = new GameState();
            _gameState.InitializeGame();
            return Ok(_gameState);
        }

        // Player Turns
        [HttpPost]
        [Route("turn")]
        public ActionResult PlayerTurn([FromBody] TurnRequest request)
        {
            _gameState.TakeTurn(request.Card1, request.Card2);

            //var result = _gameState.TakeTurn(request.Card1, request.Card2);
            //if (!result)
            //{
            //    return BadRequest("Invalid move");
            //}
            return Ok(_gameState);
        }

        // Tracking Score and Game State
        [HttpGet]
        [Route("state")]
        public ActionResult<GameState> GetGameState()
        {
            return Ok(_gameState);
        }

        // End Game and Reset
        [HttpPost]
        [Route("reset")]
        public ActionResult ResetGame()
        {
            _gameState = new GameState();
            return Ok(_gameState);
        }
    }

    public class TurnRequest
    {
        public int Card1 { get; set; }
        public int Card2 { get; set; }
    }

    public class GameState
    {
        public Dictionary<int, Card> Cards { get; set; }
        public int[] Scores { get; set; }
        public int CurrentPlayer { get; set; }

        public GameState()
        {
            Cards = new Dictionary<int, Card>();
            Scores = new int[2];
        }

        public void InitializeGame()
        {
            // Initialize cards and shuffle them
            var pairs = Enumerable.Range(1, 10).SelectMany(x => new[] { x, x }).OrderBy(x => Guid.NewGuid()).ToList();
            for (int i = 0; i < pairs.Count; i++)
            {
                Cards[i] = new Card { Value = pairs[i], IsMatched = false,IsFlipped=false };
            }

            // Initialize scores
            Scores[0] = 0;
            Scores[1] = 0;

            // Randomly decide who starts
            CurrentPlayer = new Random().Next(1,3);
        }

        public bool TakeTurn(int card1, int card2)
        {
            // Check if cards exist and are not already matched
            if (!Cards.ContainsKey(card1) || !Cards.ContainsKey(card2))
            {
                return false;
            }

            // Check if cards match
            if (Cards[card1].Value == Cards[card2].Value)
            {
                // If they do, remove them from the game and award a point to the current player
                Cards[card1].IsFlipped = true;
                Cards[card1].IsMatched = true;
                Cards[card2].IsFlipped = true;
                Cards[card2].IsMatched = true;
                Scores[CurrentPlayer - 1]++;
            }
            else
            {
                // If they don't, switch turns
                CurrentPlayer = CurrentPlayer == 1 ? 2 : 1;  // Adjusted this line
            }

            return true;
        }
    }

    public class Card
    {
        public int Value { get; set; }
        public bool IsMatched { get; set; }
        public bool IsFlipped { get; set; }
    }
}



