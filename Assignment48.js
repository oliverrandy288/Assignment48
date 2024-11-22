// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API URL and keys (replace with your actual keys)
const publicKey = '<YOURPUBLICKEY>';
const privateKey = '<YOURPRIVATEKEY>';
const hash = '<YOURHASH>'; // Generate this from the MD5 hash of 1 + privateKey + publicKey

const API_URL = `https://gateway.marvel.com/v1/public/characters?ts=1&apikey=${publicKey}&hash=${hash}`;

// CharacterList component to display list of characters
const CharacterList = ({ onCharacterClick }) => {
    const [characters, setCharacters] = useState([]);
    
    // Fetching characters data using useEffect
    useEffect(() => {
        axios.get(API_URL)
            .then((response) => {
                setCharacters(response.data.data.results);
            })
            .catch((error) => {
                console.error('Error fetching characters:', error);
            });
    }, []);

    return (
        <div className="character-list">
            {characters.map((character) => (
                <div 
                    key={character.id}
                    className="character-card"
                    onClick={() => onCharacterClick(character.id)}
                >
                    <img 
                        src={`${character.thumbnail.path}.${character.thumbnail.extension}`} 
                        alt={character.name}
                    />
                    <h3>{character.name}</h3>
                </div>
            ))}
        </div>
    );
};

// CharacterDetail component to display details of selected character
const CharacterDetail = ({ characterId }) => {
    const [characterDetail, setCharacterDetail] = useState(null);
    
    useEffect(() => {
        if (!characterId) return;
        
        // Fetching detailed character data
        const characterDetailURL = `https://gateway.marvel.com/v1/public/characters/${characterId}?ts=1&apikey=${publicKey}&hash=${hash}`;
        
        axios.get(characterDetailURL)
            .then((response) => {
                setCharacterDetail(response.data.data.results[0]);
            })
            .catch((error) => {
                console.error('Error fetching character detail:', error);
            });
    }, [characterId]);

    if (!characterDetail) {
        return <div>Select a character to see more details.</div>;
    }

    return (
        <div className="character-detail">
            <h2>{characterDetail.name}</h2>
            <p>{characterDetail.description || 'No description available.'}</p>
            <h3>Comics:</h3>
            <ul>
                {characterDetail.comics.items.map((comic) => (
                    <li key={comic.resourceURI}>{comic.name}</li>
                ))}
            </ul>
        </div>
    );
};

// Main App component
const App = () => {
    const [selectedCharacterId, setSelectedCharacterId] = useState(null);

    const handleCharacterClick = (id) => {
        setSelectedCharacterId(id);
    };

    return (
        <div className="app">
            <h1>Marvel Comics Characters</h1>
            <div className="content">
                <CharacterList onCharacterClick={handleCharacterClick} />
                <CharacterDetail characterId={selectedCharacterId} />
            </div>
        </div>
    );
};

export default App;
