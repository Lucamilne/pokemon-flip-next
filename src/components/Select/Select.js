import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchStarterCards, createCard } from '@/utils/cardHelpers.js';
import PokeballSplash from "../PokeballSplash/PokeballSplash.js";
import Profile from "../Profile/Profile.js"
import { useGameContext } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import SearchBar from './SearchBar.js';
import CardGrid from './CardGrid.js';
import MobileProfileToggle from './MobileProfileToggle.js';
import PlayerHand from './PlayerHand.js';

export default function Select() {
    const location = useLocation();
    const pathname = location.pathname;
    const rootPath = '/' + pathname.split('/').filter(Boolean)[0];

    const { setSelectedPlayerHand, resetGameState, lastSelectedHand, setLastSelectedHand, isMobile } = useGameContext();
    const { userCollection, isLoadingCollection } = useAuth();

    const cardGridRef = useRef(null);
    const playerHandRef = useRef([null, null, null, null, null]);

    const [playerHand, setPlayerHand] = useState([null, null, null, null, null]);
    const [pokeballIsOpen, setPokeballIsOpen] = useState(false);
    const [isPokeballDisabled, setIsPokeballDisabled] = useState(true);
    const [searchString, setSearchString] = useState('');
    const [lastPokemonCardSelected, setLastPokemonCardSelected] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showProfile, setShowProfile] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const [sortByStrength, setSortByStrength] = useState(() => {
        return sessionStorage.getItem('sortByStrength') === 'true';
    });
    const [showProfilesOnMobile, setShowProfilesOnMobile] = useState(() => {
        return sessionStorage.getItem('showProfilesOnMobile') !== 'false';
    });

    useEffect(() => {
        sessionStorage.setItem('sortByStrength', sortByStrength);
    }, [sortByStrength]);

    useEffect(() => {
        sessionStorage.setItem('showProfilesOnMobile', showProfilesOnMobile);
        if (!showProfilesOnMobile) {
            setShowProfile(false);
        }
    }, [showProfilesOnMobile]);

    const handleCloseProfile = useCallback(() => setShowProfile(false), []);

    useEffect(() => {
        resetGameState();
        setPokeballIsOpen(true);
        const helpTimer = setTimeout(() => { setShowHelp(true); }, 3000);
        return () => clearTimeout(helpTimer);
    }, []);

    useEffect(() => {
        if (!isLoadingCollection && cardGridRef.current) {
            cardGridRef.current.focus();
        }
    }, [isLoadingCollection]);

    const playerCardLibrary = useMemo(() => {
        const ownedPokemonNames = Object.keys(userCollection);
        if (ownedPokemonNames.length > 0) {
            return ownedPokemonNames
                .map(name => createCard(name, true))
                .sort((a, b) => a.id - b.id);
        } else {
            return fetchStarterCards(true);
        }
    }, [userCollection]);

    const closePokeball = useCallback(() => {
        setIsPokeballDisabled(false);
        setPokeballIsOpen(false);
    }, []);

    useEffect(() => {
        if (!isMobile) setShowProfile(true);
        else if (searchString.trim()) setShowProfile(false);
    }, [isMobile, searchString]);

    useEffect(() => {
        playerHandRef.current = playerHand;
        const emptyHand = playerHand.every(card => card === null);
        const fullHand = playerHand.every(card => card !== null);
        if (emptyHand) setLastPokemonCardSelected(null);
        setShowConfirm(fullHand);
        if (fullHand) {
            setShowProfile(false);
            setSelectedPlayerHand(playerHand);
        }
    }, [playerHand]);

    const selectedCardIds = useMemo(() =>
        new Set(playerHand.filter(Boolean).map(card => card.id))
    , [playerHand]);

    const filteredCards = useMemo(() => {
        const trimmedSearch = searchString.trim().toLowerCase();
        let cards = trimmedSearch
            ? playerCardLibrary.filter(pokemonCard =>
                pokemonCard?.name.toLowerCase().includes(trimmedSearch)
            )
            : playerCardLibrary;

        if (sortByStrength) {
            return [...cards].sort((a, b) => b.statWeight - a.statWeight);
        }
        return cards;
    }, [searchString, playerCardLibrary, sortByStrength]);

    const togglePokemonCardSelection = useCallback((pokemonCard) => {
        if (!pokemonCard) return;
        setSearchString('');
        const isCardInHand = playerHandRef.current.some(card => card?.id === pokemonCard.id);

        setPlayerHand(prev => {
            const cardIndex = prev.findIndex(card => card?.id === pokemonCard.id);
            if (cardIndex !== -1) {
                const newHand = [...prev];
                newHand[cardIndex] = null;
                return newHand;
            }
            const firstNullIndex = prev.findIndex(card => card === null);
            if (firstNullIndex === -1) return prev;
            const newHand = [...prev];
            newHand[firstNullIndex] = pokemonCard;
            return newHand;
        });

        if (isMobile && !isCardInHand) setShowProfile(true);
        setLastPokemonCardSelected(pokemonCard);
    }, [isMobile]);

    const handleToggleSort = useCallback(() => setSortByStrength(prev => !prev), []);

    const handleClear = useCallback(() => setPlayerHand([null, null, null, null, null]), []);

    const handleConfirm = useCallback(() => {
        closePokeball();
        setLastSelectedHand(playerHandRef.current);
    }, [closePokeball, setLastSelectedHand]);

    const handleShowProfile = useCallback(() => {
        setLastPokemonCardSelected(null);
        setShowProfile(true);
    }, []);

    const handleSetShowProfilesOnMobile = useCallback((value) => {
        setShowProfilesOnMobile(value);
        if (!value) handleCloseProfile();
    }, [handleCloseProfile]);

    return (
        <div className="relative overflow-y-hidden h-full flex flex-col bg-pokedex-lighter-blue">
            <SearchBar
                searchString={searchString}
                onSearchChange={setSearchString}
                sortByStrength={sortByStrength}
                onToggleSort={handleToggleSort}
            />
            <div className="relative grow md:flex overflow-y-auto">
                <CardGrid
                    isLoadingCollection={isLoadingCollection}
                    filteredCards={filteredCards}
                    selectedCardIds={selectedCardIds}
                    onCardSelect={togglePokemonCardSelection}
                    cardGridRef={cardGridRef}
                />
                {isMobile && (
                    <MobileProfileToggle
                        showProfilesOnMobile={showProfilesOnMobile}
                        onSetShowProfilesOnMobile={handleSetShowProfilesOnMobile}
                        onShowProfile={handleShowProfile}
                    />
                )}
                {(!isMobile || showProfilesOnMobile) && (
                    <Profile
                        playerHand={playerHand}
                        lastSelectedHand={lastSelectedHand}
                        setPlayerHand={setPlayerHand}
                        lastPokemonCardSelected={lastPokemonCardSelected}
                        isOpen={showProfile && !showConfirm}
                        onClose={isMobile ? handleCloseProfile : undefined}
                    />
                )}
            </div>
            {showConfirm && (
                <div className="absolute inset-0 bg-black/60 pointer-events-none md:pointer-events-auto" />
            )}
            <PlayerHand
                playerHand={playerHand}
                showConfirm={showConfirm}
                showHelp={showHelp}
                onCardClick={togglePokemonCardSelection}
                onClear={handleClear}
                onConfirm={handleConfirm}
            />
            <PokeballSplash pokeballIsOpen={pokeballIsOpen} disabled={isPokeballDisabled} href={isPokeballDisabled ? null : `${rootPath}/play`} buttonText='Fight!' />
        </div>
    );
}
