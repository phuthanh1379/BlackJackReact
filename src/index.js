import React from 'react';
import ReactDOM from 'react-dom';
import './styles/stylesheet/index.css';

class CarteSlot extends React.Component {
  render() {
    return (
      <div className="carte-slot"
        style={{backgroundImage: 'url(' + require(`${this.props.link}`) + ')'}}
      >
      </div>
    );
  }
}

class Dealer extends React.Component {
  renderCarte(i) {
    let n = this.props.dealerList[i];
    if (n != null) {
      var s = n.toString();
    } else s = "carte_face1";
    return (
      <CarteSlot
        link={"./materials/" + s + ".png"}
      />
    );
  }

  render() {
    return (
      <div className="dealer-board">
        <p> DEALER {this.props.dscore} </p>
        <ul id="horizontal-list">
          <li> {this.renderCarte(0)} </li>
          <li> {this.renderCarte(1)} </li>
          <li> {this.renderCarte(2)} </li>
          <li> {this.renderCarte(3)} </li>
          <li> {this.renderCarte(4)} </li>
        </ul>
      </div>
    );
  }
}

class Jouer extends React.Component {
  renderCarte(i) {
    let n = this.props.jouerList[i];
    if (n != null) {
      var s = n.toString();
    } else s = "carte_face";
    return (
      <CarteSlot
        link={"./materials/" + s + ".png"}
      />
    );
  }

  render() {
    return (
      <div className="jouer-board">
        <p> JOUER {this.props.jscore} </p>
        <ul id="horizontal-list">
          <li id="jl01"> {this.renderCarte(0)} </li>
          <li id="jl02"> {this.renderCarte(1)} </li>
          <li id="jl03"> {this.renderCarte(2)} </li>
          <li id="jl04"> {this.renderCarte(3)} </li>
          <li id="jl05"> {this.renderCarte(4)} </li>
        </ul>
      </div>
    );
  }
}

class Buttons extends React.Component {
  render() {
    return (
      <div className="buttons">
        <button className="nouvelle-partie"
          onClick={() => this.props.onClickNP()} 
        >
          Nouvelle Partie
        </button>

        <button className="prend"
          onClick={() => this.props.onClickPUC()}
        >
          Prend 1 Carte
        </button>

        <button className="terminer"
          onClick={() => this.props.onClickT()}
        >
          Terminer
        </button>
      </div>
    );
  }
}

class Stats extends React.Component {
  render() {
    return (
      <div className="stats-display">
        <div className="round-winner">
          <h3> {this.props.endWinner} </h3>
        </div>
        <div className="game-stats">
          <p> Game(s) have played:  {this.props.gamesPlayed} </p>
          <p> - AI Won: {this.props.AIWinrate} </p>
          <p> - Draw: {this.props.drawRate} </p>
          <p> - Jouer won: {this.props.jouerWinrate} </p>
          <p> + With: Double-A ({this.props.jdAWinrate}), BlackJack ({this.props.jBJWinrate}) </p>
          <p> + Winrate when holding: 2 ({this.props.j2Winrate}), 3 ({this.props.j3Winrate}), </p>
          <p> 4 ({this.props.j4Winrate}), 5 ({this.props.j5Winrate}) </p>
          <p> Carte(s) have picked: {this.props.jouerCartesPicked} </p>          
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dealerList: Array(5).fill(null),
      dealerCarte: Array(5).fill(null),
      jouerList: Array(5).fill(null),
      jouerCarte: Array(5).fill(null),
      endWinner: String,
      statsGame: {
        gamesPlayed: 0,
        AIWinCount: 0,
        drawCount: 0,
        jouerWinCount: 0,
        jdAWinCount: 0,
        jBJWinCount: 0,
        j2WinCount: 0,
        j3WinCount: 0,
        j4WinCount: 0,
        j5WinCount: 0,
        jouerCartesPicked: 0
      }
    };
  }

  distribuer() {
    // Fill the deck.
    const jouerList = this.state.jouerList;
    const dealerList = this.state.dealerList;
    const jouerCarte = this.state.jouerCarte;
    const dealerCarte = this.state.dealerCarte;
    const gamesPlayed = this.state.statsGame.gamesPlayed;

    // Flush the cartes from last game
    jouerList.fill(null);
    dealerList.fill(null);
    jouerCarte.fill(null);
    dealerCarte.fill(null);

    // Random 2 cartes for each jouer.
    // Jouer first
    var j1 = Math.floor((Math.random() *52) + 1);
    //jouerList[0] = deckList[j1];
    jouerList[0] = j1;
    jouerCarte[0] = carteValue(j1);
    
    // Get the 2nd roll. A while loop to call for the different in the rolls
    var j2 = 0;
    do {
      j2 = Math.floor((Math.random() *52) + 1);
    }
    while (j2 === j1);
    jouerList[1] = j2;
    jouerCarte[1] = carteValue(j2);

    // Dealer
    // 1st carte random in loop until it is different from jouer's cartes
    var d1 = 0;
    var d2 = 0;
    do {
      d1 = Math.floor((Math.random() *52) + 1);
    }
    while (d1 === j2 || d1 === j1);
    dealerList[0] = d1;
    dealerCarte[0] = carteValue(d1);

    // 2nd carte is the same
    do {
      d2 = Math.floor((Math.random() *52) + 1);
    }
    while (d2 === j2 || d2 === j1 || d2 === d1);
    dealerList[1] = d2;
    dealerCarte[1] = carteValue(d2);

    this.setState({
      dealerList: dealerList,
      jouerList: jouerList,
      dealerCarte: dealerCarte,
      jouerCarte: jouerCarte,
      // jScore: carteTotalValue(jouerCarte),
      // dScore: carteTotalValue(dealerCarte),
      endWinner: " ",
      // statsGame: {
      //   gamesPlayed: gamesPlayed++
      // }
    });
    return;
  }

  prendUneCarte() {
    // JOUER prend une carte
    const jouerList = this.state.jouerList;
    const dealerList = this.state.dealerList;
    const jouerCarte = this.state.jouerCarte;
    const jouerCartesPicked = this.state.statsGame.jouerCartesPicked;
    
    // Check if jouer's score has exceeded limit (21)
    // or jouer already has 5 cartes
    // or jouer has got DoubleA / BlackJack
    if ((carteTotalValue(jouerCarte) >= 21) || 
      (jouerList[4] !== null) ||
      (carteTotalValue(jouerCarte) === 1 || carteTotalValue(jouerCarte) === 2)) {
        alert('Vous ne pouvez pas prendre plus de cartes.');
        return;
    }
    else {
      var dp = 0;
      // Random a carte until it iz different with any existed carte on the board
      do {
        dp = Math.floor((Math.random() *52) + 1);
      }
      while (checkDuplicateCarte(dp, dealerList, jouerList));
      // Ajouter à la main du joueur 
      var n = 0; // number of current cartes
      for (let i = 0; i < jouerList.length; i++) {
        if (jouerList[i] !== 0 && jouerList[i] !== null) {
          n++;
        }
      }
      jouerList[n] = dp;
      jouerCarte[n] = carteValue(dp);
      this.setState({
        jouerList: jouerList,
        jouerCarte: jouerCarte,
        // statsGame: {
        //   jouerCartesPicked: jouerCartesPicked++
        // }
      });
      return;
    }
  }

  prendUneCarteAI() {
    // sub-function for AI to draw a carte
    const dealerList = this.state.dealerList;
    const jouerList = this.state.jouerList;
    const dealerCarte = this.state.dealerCarte;
    // const dscore = this.state.dScore;

    // Check the limit
    if ((carteTotalValue(dealerCarte) >= 21) || 
      (dealerList[4] !== null) ||
      (carteTotalValue(dealerCarte) === 1 || carteTotalValue(dealerCarte) === 2)) {
      // console.log('return when pick');
      return;
    }
    else {
      var dp = 0;
      // Random a carte until it iz different with any existed carte
      do {
        dp = Math.floor((Math.random() * 52) + 1);
      }
      while (checkDuplicateCarte(dp, dealerList, jouerList));

      var n = 0; // number of current cartes
      for (let i = 0; i < dealerList.length; i++) {
        if (dealerList[i] !== 0 && dealerList[i] !== null) {
          n++;
        }
      }

      dealerList[n] = dp;
      dealerCarte[n] = carteValue(dp);
      this.setState({
        dealerList: dealerList,
        dealerCarte: dealerCarte
        // dScore: carteTotalValue(dealerCarte)
      });
      console.log('Picked and setState: ' + carteTotalValue(dealerCarte).toString());
      return;
    }
  }

  procedureAI() {
    // AI's process to win the game (or try to)
    const jouerList = this.state.jouerList;
    // const dealerList = this.state.dealerList;
    const dealerCarte = this.state.dealerCarte;
    // const dscore = this.state.dScore;

    // Check its own score if it has passed the threshold (17)
    while (carteTotalValue(dealerCarte) < 17 && this.state.dealerList[4] === null 
      && carteTotalValue(dealerCarte) !== 1 && carteTotalValue(dealerCarte) !== 2) {
      // While AI's score < 17 and it has < 5 cartes
      // console.log('call the prend');
      this.prendUneCarteAI();
      // console.log('after the call');
      if (this.state.dealerList[4] !== null || carteTotalValue(dealerCarte) >= 17) {
        break;
      }
    }
    
    // Check the situation for next steps
    if ((this.state.dealerList[4] !== null && this.state.dealerList[4] !== 0) || 
    carteTotalValue(dealerCarte) === 1 || carteTotalValue(dealerCarte) === 2 || 
    carteTotalValue(dealerCarte) >= 21) {
      // If AI has 5 cartes or AI has double-A or BlackJack or >= 21, 
      // no need to do anything else.---> it is done
      return;
    } 
    else {
      // AI's score has reached above 17 and not reach 5 cartes yet
      // The strategy: 
      // **IF jouer has 4 or 5 cartes, there's a high possibility that 
      // jouer's score is above 21, so AI would remain its score in that case.
      // ------------------------------------------------------------------------
      // **IF jouer has 3 cartes, there is a slightly higher chance that 
      // jouer's score is still within maximum threshold. Therefore AI would
      // only end the game if it has considerable score (18 --> 21)
      // ------------------------------------------------------------------------
      // **IF jouer has only 2 cartes, jouer's score definitely acceptable
      // around 17 --> 20, also those highrollers' scores: double-A and BlackJack.
      // Thus AI must try to draw some more cartes if its current score is only 
      // around 17, 18. 
      // ------------------------------------------------------------------------
      // ****NOTE: IF jouer attempts to terminer at 17 score many times, 
      // AI would record the `possiblity` for this and increase its rate, 
      // hence perform different actions in the next case. But this is a rather
      // complicated function, so the author would save it for the other occasion xD.
      
      // Jouer has 4 or 5 cartes
      if (jouerList[4] !== null || (jouerList[3] !== null && jouerList[4] === null)) {
        // Stay at this score. End the game.
        return;
      }
      // Jouer has 3 cartes
      else if (jouerList[2] !== null && jouerList[3] === null) {
        if (carteTotalValue(dealerCarte) < 18) {
          // Pick 1 carte is enough --- no it's not, somehow with the tricky Ace 17score can get to 13 xD
          do {
            this.prendUneCarteAI();
            // console.log('after the call');
            if (this.state.dealerList[4] !== null || carteTotalValue(dealerCarte) >= 17) {
              break;
            }
          }
          while (carteTotalValue(dealerCarte) < 17 && this.state.dealerList[4] === null 
            && carteTotalValue(dealerCarte) !== 1 && carteTotalValue(dealerCarte) !== 2);

          // the prendUneCarteAI() has already updated the data
          return;
        }
        else {           
          return;
        }
      }
      // Jouer has 2 cartes
      else {
        while (carteTotalValue(dealerCarte) <= 18) {
          this.prendUneCarteAI();
        }
          return;
      }
    }   
  }

  finDuJeu() {
    // End the game when jouer press button `Terminer`
    // This is also AI's turn to play, and the outcome.
    // ================================================
    // Note: Both players (AI and human) cannot see their opponent's cartes
    const jouerList = this.state.jouerList; // AI only see the number of cartes on jouer main
    const dealerList = this.state.dealerList;
    const jouerCarte = this.state.jouerCarte;
    // const jscore = this.state.jScore; // To calculate the winner
    // const dscore = this.state.dScore;
    const dealerCarte = this.state.dealerCarte;

    // First, jScore must exceed acceptable score (>=17)
    // or Jouer has 5 cartes
    if (carteTotalValue(jouerCarte) !== 1 && carteTotalValue(jouerCarte) !== 2 
      && carteTotalValue(jouerCarte) < 17 && jouerList[4] === null) {
      alert('Votre score doit être au moins de 17.');
      return;
    }
    else {
      // Set the AI's dscore
      this.setState({
        dScore: carteTotalValue(dealerCarte)
      });

      // Let the AI's process begin
      this.procedureAI();

      // Calculate winner
      console.log(carteTotalValue(jouerCarte).toString() + " " + carteTotalValue(dealerCarte).toString());
      switch (calcWinner(carteTotalValue(dealerCarte), carteTotalValue(jouerCarte), dealerList, jouerList)) {
        case -1:
          // AI won
          this.setState({
            endWinner: "AI est victorieux!"
          });
          return;
        case 0:
          // Draw
          this.setState({
            endWinner: "Jeu est nul!"
          });
          return;
        case 1:
          // Jouer won
          this.setState({
            endWinner: "Vous avez gagné!"
          });
          return;
        default: 
          return;
      }
    }

  }

  render() {
    const jouerList = this.state.jouerList;
    const dealerList = this.state.dealerList;
    const jouerCarte = this.state.jouerCarte;
    const dealerCarte = this.state.dealerCarte;
    const endWinner = this.state.endWinner;
    const statsGame = this.state.statsGame;

    return (
      <div className="game-board">
        <Stats
          endWinner={endWinner}
        />
        <Dealer
          dealerList={dealerList}
          dscore={carteTotalValue(dealerCarte)}/>

        <div className="game-title"/>
        <Jouer
          jouerList={jouerList}
          jscore={carteTotalValue(jouerCarte)}/>

        <Buttons
          onClickNP={() => this.distribuer()}
          onClickPUC={() => this.prendUneCarte()}
          onClickT={() => this.finDuJeu()}/>
      </div>
    );
  }
}
  
// ========================================
  
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function carteValue(carteID) {
  switch (carteID) {
    case 5:
    case 6:
    case 7: 
    case 8:
      return 2;
    case 9:
    case 10:
    case 11: 
    case 12:
      return 3;
    case 13:
    case 14:
    case 15:
    case 16:
      return 4;
    case 17:
    case 18:
    case 19:
    case 20:
      return 5;
    case 21:
    case 22:
    case 23:
    case 24:
      return 6;
    case 25:
    case 26:
    case 27:
    case 28:
      return 7;
    case 29:
    case 30:
    case 31:
    case 32:
      return 8;
    case 33:
    case 34:
    case 35:
    case 36:
      return 9;
    case 37:
    case 38:
    case 39:
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 48:
    case 49:
    case 50:
    case 51:
    case 52:
      return 10;
    case 1:
    case 2:
    case 3:
    case 4:
      return 11;
    default:
      return 0;
  }
}

function carteTotalValue(carteList) {
  // minimum score: 3 (A, 2)
  // so we can have a range [1, 2] to store possible outcomes
  // for instance: 
  // 1- double A (A, A)
  // 2- Blackjack (A, 10[value])

  var n = 0; // number of current cartes
  for (let i = 0; i < carteList.length; i++) {
    if (carteList[i] !== null) {
      n++;
    }
  }

  switch (n) {
    default:
    case 0:
    case 1:
      return 0;
    // ==============================================================================
    case 2:
      // Double A
      if (carteList[0] === 11 && carteList[1] === 11) {
        return 1;
      } 
      // BlackJack
      else if ((carteList[0] === 11 && carteList[1] === 10) 
        || (carteList[1] === 11 && carteList[0] === 10)) {
        return 2;
      }
      else {
        return (carteList[0] + carteList[1]);
      }
    // ==============================================================================
    case 3:
      // No A
      if (carteList[0] !== 11 && carteList[1] !== 11 && carteList[2] !== 11) {
        return (carteList[0] + carteList[1] + carteList[2]);
      }

      // 1 A
      else if ((carteList[0] === 11 && carteList[1] !== 11 && carteList[2] !== 11) ||
        (carteList[1] === 11 && carteList[0] !== 11 && carteList[2] !== 11) ||
        (carteList[2] === 11 && carteList[1] !== 11 && carteList[0] !== 11)) {
        // Calculate sum value of non-A cartes
        var sum = 0;
        for (let i = 0; i < 3; i++) {
          if (carteList[i] !== 11) {
            sum += carteList[i];
          }
        }

        if (sum + 11 > 21) {
          if (sum + 10 > 21) {
            return (sum + 1);
          }
          else 
            return (sum + 10);
        }
        else 
          return (sum + 11);
      }

      // 2 A
      else {
        // Calculate sum value of non-A cartes
        sum = 0;
        for (let i = 0; i < 2; i++) {
          if (carteList[i] !== 11) {
            sum += carteList[i];
          }
        }

        // Only 3 possible cases: 1 A must be at 1 value, 
        // the other one varies in array [1, 10, 11]
        if (sum + 12 > 21) {
          if (sum + 11 > 21) {
            return (sum + 2);
          }
          else 
            return (sum + 11);       
        }
        else 
          return (sum + 12);
      }
    // ==============================================================================
    case 4:
      // At 4 cartes, Ace counts as 1 (value)
      sum = 0;
      for (let i = 0; i < 4; i++) {
        if (carteList[i] !== 11) {
          sum += carteList[i];
        }
        else
          sum += 1;
      }
      return sum;
    // ==============================================================================  
    case 5:
      // At 5 cartes, Ace counts as 1 (value)
      // Calculate sum value of non-A cartes
      sum = 0;
      for (let i = 0; i < 5; i++) {
        if (carteList[i] !== 11) {
          sum += carteList[i];
        }
        else
          sum += 1;
      }
      return sum;
  }
}

function checkDuplicateCarte(carteID, dList, jList) {
  // Return true if carte is duplicate, return false otherwise
  var res = false;
  for (let i = 0; i < dList.length; i++) {
    if (carteID === dList[i]) {
      res = true;
    }
  }
  for (let i = 0; i < jList.length; i++) {
    if (carteID === jList[i]) {
      res = true;
    }
  }
  return res;
}

function calcWinner(dscore, jscore, dList, jList) {  
  // RULES (at least in my place tho): double-A(1) > 5-small-rolls > BlackJack(2).
  // Return -1 if AI currently won, 0 if draw, and 1 if jouer won.
  // First check if any player has exceed 21
  var dHas5 = false; // jouer 5 cartes yet?
  var jHas5 = false; // dealer 5 cartes yet?

  if (dList[4] !== null && dList[4] !== 0) {
    dHas5 = true;
  }

  if (jList[4] !== null && jList[4] !== 0) {
    jHas5 = true;
  }

  // Calculate the winner
  // Jouer got 5 cartes
  if (jHas5) {
    if (jscore <= 21) {
      if (dHas5) {
        if (dscore < jscore) {
          return -1; // AI won
        }
        else if (dscore === jscore) {
          return 0; // draw
        }
        else
          return 1; // Jouer won
      }
      else {
        // AI has double-A
        if (dscore === 1) {
          return -1; // AI won
        }
        else
          return 1; // Jouer won
      }
    }
    else {
      if (dscore > 21) {
        return 0; // draw
      }
      else 
        return -1; // AI won
    }
  }
  else {
    if (jscore <= 21) {
      // Jouer has double-A
      if (jscore === 1) {
        if (dscore === 1) {
          return 0; // draw
        }
        else {
          return 1; // Jouer won
        }
      }
      // Jouer has BlackJack
      else if (jscore === 2) {
        if (dHas5) {
          if (dscore <= 21) {
            return -1; // AI won
          }
          else
            return 1; // Jouer won
        }
        else {
          if (dscore === 1) {
            return -1; // AI won
          }
          else if (dscore === 2) {
            return 0; // draw
          }
          else 
            return 1; // Jouer won
        }
      }
      // Normal case, jscore <=21
      else {
        if (dHas5) {
          if (dscore <= 21) {
            return -1; // AI won
          }
          else
            return 1; // Jouer won
        }
        else {
          if (dscore === 2 || dscore === 1 || (dscore > jscore && dscore <= 21)) {
            return -1; // AI won
          }
          else if (dscore === jscore) {
            return 0; // draw
          }
          else
            return 1; // Jouer won
        }
      }
    }
    else {
      if (dscore > 21) {
        return 0; // draw
      }
      else
        return -1; // AI won
    }
  }
}