import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import Card from './Card';
import './CardGame.css';

const BASE_URL = 'http://deckofcardsapi.com/api/deck';

const CardGame = () => {
    /** Holds the deck data. */
    const [deck, setDeck] = useState(null);
    /** Holds the drawn cards from the deck. */
    const [drawnDeck, setDrawnDeck] = useState([]);
    /** Toggle between drawing and stop drawing cards from the deck */
    const [autoDraw, setAutoDraw] = useState(false);
    /** Game timer for drawing cards */
    const timer = useRef(null);

    /** Gets the deck data from the API and sets the deck game data when game loads. */
    useEffect(() => {
        async function getDeckData() {
            const res = await axios.get(`${BASE_URL}/new/shuffle`);
            setDeck(res.data);
            console.log(`DECK: ${res.data.deck_id}`)
        }
        getDeckData();
    }, [setDeck]);

    /** Calls the API to get the card when the drawCard toggles autoDraw to true. */
    useEffect(() => {
        async function getCard() {
            const { deck_id } = deck;
            try {
                const res = await axios.get(`${BASE_URL}/${deck_id}/draw/`);
                if (res.data.remaining !== 0) {
                    setDrawnDeck(drawnDeck => [...drawnDeck, res.data.cards[0]]);
                } else {
                    setAutoDraw(false);
                    throw new Error('The deck is empty!');
                }
            } catch (e) {
                alert(e);
            }
        }

        if (autoDraw && !timer.current) {
            timer.current = setInterval(async () => {
              await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timer.current);
            timer.current = null;
          }
     }, [autoDraw, setAutoDraw, deck]);

    /** Shuffle the deck and restart the board. */
    // useEffect(() => {
    //     const { deck_id } = deck;
    //     async function shuffleDeck() {
    //         const res = await axios.get(`${BASE_URL}/${deck_id}/shuffle`);
    //         setDeck(res.data);
    //         console.log(`DECK: ${res.data.deck_id}`)
    //     }
    //     shuffleDeck();
    // }, [setDrawnDeck]);

    /** Toggles auto draw on/off */
    const startDrawing = () => {
        setAutoDraw(autoDraw => !autoDraw);
    };

    /** Clears existing gameboard and gets a new deck. */
    const newDeck = () => {
        // window.location.reload(); this reloads the window
        //clear the existing drawn cards deck
        setDrawnDeck(() => []);
    }

    return (
        <div className="game">
            <h1>Deck of Cards Game</h1>
            <div>
                {deck !== null ? <button onClick={startDrawing}> {autoDraw ? 'STOP DRAWING!' : 'GIMME A CARD!'} </button> : 
                <h2>...Loading Deck</h2>}
                <button onClick={newDeck}>NEW DECK?</button>
            </div>
            <div>
                {drawnDeck.map(card => <Card key={card.code} image={card.image} name={`${card.value}-${card.suit}`}/>)}
            </div>
        </div>
    )
}

export default CardGame;