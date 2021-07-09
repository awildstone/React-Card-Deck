import React from 'react';
import './Card.css';

/** Renders a single card from the CardGame. */

const Card = ({ image, name }) => {
    return (
        <img src={image} alt={name}></img>
    )
}

export default Card;