import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PokeballSplash from '@/components/PokeballSplash/PokeballSplash.js';
import Profile from '@/components/Profile/Profile.js';
import CardLibrary from './components/CardLibrary.jsx';
import HandBuilder from './components/HandBuilder.jsx';
import MobileProfileControls from './components/MobileProfileControls.jsx';
import SelectionToolbar from './components/SelectionToolbar.jsx';
import { useAuth } from '@/contexts/AuthContext';
import { useGameContext } from '@/contexts/GameContext';
import useCardLibrary from './hooks/useCardLibrary.js';
import useSelectHand from './hooks/useSelectHand.js';
import useSelectPreferences from './hooks/useSelectPreferences.js';

export default function Select() {
    const { pathname } = useLocation();
    const rootPath = `/${pathname.split('/').filter(Boolean)[0]}`;
    const { setSelectedPlayerHand, resetGameState, lastSelectedHand, setLastSelectedHand, isMobile } = useGameContext();
    const { userCollection, isLoadingCollection } = useAuth();
    const cardGridRef = useRef(null);
    const [pokeballIsOpen, setPokeballIsOpen] = useState(false);
    const [isPokeballDisabled, setIsPokeballDisabled] = useState(true);
    const [searchString, setSearchString] = useState('');
    const [showHelp, setShowHelp] = useState(false);

    const preferences = useSelectPreferences({ isMobile, searchString });
    const hand = useSelectHand({ isMobile, setSelectedPlayerHand });
    const { filteredCards } = useCardLibrary({ userCollection, searchString, sortByStrength: preferences.sortByStrength });

    useEffect(() => {
        resetGameState();
        setPokeballIsOpen(true);
        const helpTimer = setTimeout(() => setShowHelp(true), 3000);
        return () => clearTimeout(helpTimer);
    }, []);

    useEffect(() => {
        if (!isLoadingCollection && cardGridRef.current) cardGridRef.current.focus();
    }, [isLoadingCollection]);

    const closePokeball = useCallback(() => {
        setIsPokeballDisabled(false);
        setPokeballIsOpen(false);
    }, []);

    const handleCardSelect = useCallback((pokemonCard) => {
        setSearchString('');
        if (hand.togglePokemonCardSelection(pokemonCard)) preferences.openProfile();
    }, [hand, preferences]);

    const handleConfirm = useCallback(() => {
        closePokeball();
        setLastSelectedHand(hand.playerHandRef.current);
    }, [closePokeball, hand.playerHandRef, setLastSelectedHand]);

    const handleShowProfile = useCallback(() => {
        hand.setLastPokemonCardSelected(null);
        preferences.openProfile();
    }, [hand, preferences]);

    const handleSetShowProfilesOnMobile = useCallback((value) => {
        preferences.setShowProfilesOnMobile(value);
        if (!value) preferences.closeProfile();
    }, [preferences]);

    return (
        <div className="relative overflow-y-hidden h-full flex flex-col bg-pokedex-lighter-blue">
            <SelectionToolbar searchString={searchString} onSearchChange={setSearchString} sortByStrength={preferences.sortByStrength} onToggleSort={preferences.toggleSort} />
            <div className="relative grow md:flex overflow-y-auto">
                <CardLibrary isLoadingCollection={isLoadingCollection} filteredCards={filteredCards} selectedCardIds={hand.selectedCardIds} onCardSelect={handleCardSelect} cardGridRef={cardGridRef} />
                {isMobile && <MobileProfileControls showProfilesOnMobile={preferences.showProfilesOnMobile} onSetShowProfilesOnMobile={handleSetShowProfilesOnMobile} onShowProfile={handleShowProfile} />}
                {(!isMobile || preferences.showProfilesOnMobile) && <Profile playerHand={hand.playerHand} lastSelectedHand={lastSelectedHand} setPlayerHand={hand.setPlayerHand} lastPokemonCardSelected={hand.lastPokemonCardSelected} isOpen={preferences.showProfile && !hand.showConfirm} onClose={isMobile ? preferences.closeProfile : undefined} />}
            </div>
            {hand.showConfirm && <div className="absolute inset-0 bg-black/60 pointer-events-none md:pointer-events-auto" />}
            <HandBuilder playerHand={hand.playerHand} showConfirm={hand.showConfirm} showHelp={showHelp} onCardClick={handleCardSelect} onClear={hand.clearHand} onConfirm={handleConfirm} />
            <PokeballSplash pokeballIsOpen={pokeballIsOpen} disabled={isPokeballDisabled} href={isPokeballDisabled ? null : `${rootPath}/play`} buttonText="Fight!" />
        </div>
    );
}
