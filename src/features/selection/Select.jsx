import { memo, useCallback, useEffect, useRef, useState } from 'react';
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

const SelectionProfile = memo(Profile);
const SelectionPokeballSplash = memo(PokeballSplash);

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

    const { sortByStrength, toggleSort, showProfilesOnMobile, setShowProfilesOnMobile, showProfile, closeProfile, openProfile } = useSelectPreferences({ isMobile, searchString });
    const { playerHand, playerHandRef, setPlayerHand, selectedCardIds, lastPokemonCardSelected, setLastPokemonCardSelected, isHandEmpty, isHandFull, togglePokemonCardSelection, clearHand } = useSelectHand({ isMobile, setSelectedPlayerHand });
    const { filteredCards } = useCardLibrary({ userCollection, searchString, sortByStrength });

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
        if (togglePokemonCardSelection(pokemonCard)) openProfile();
    }, [openProfile, togglePokemonCardSelection]);

    const handleConfirm = useCallback(() => {
        closePokeball();
        setLastSelectedHand(playerHandRef.current);
    }, [closePokeball, playerHandRef, setLastSelectedHand]);

    const handleShowProfile = useCallback(() => {
        setLastPokemonCardSelected(null);
        openProfile();
    }, [openProfile, setLastPokemonCardSelected]);

    const handleSetShowProfilesOnMobile = useCallback((value) => {
        setShowProfilesOnMobile(value);
        if (!value) closeProfile();
    }, [closeProfile, setShowProfilesOnMobile]);

    return (
        <div className="relative overflow-y-hidden h-full flex flex-col bg-pokedex-lighter-blue">
            <SelectionToolbar searchString={searchString} onSearchChange={setSearchString} sortByStrength={sortByStrength} onToggleSort={toggleSort} />
            <div className="relative grow md:flex overflow-y-auto">
                <CardLibrary isLoadingCollection={isLoadingCollection} filteredCards={filteredCards} selectedCardIds={selectedCardIds} onCardSelect={handleCardSelect} cardGridRef={cardGridRef} />
                {isMobile && <MobileProfileControls showProfilesOnMobile={showProfilesOnMobile} onSetShowProfilesOnMobile={handleSetShowProfilesOnMobile} onShowProfile={handleShowProfile} />}
                {(!isMobile || showProfilesOnMobile) && <SelectionProfile playerHand={playerHand} lastSelectedHand={lastSelectedHand} setPlayerHand={setPlayerHand} lastPokemonCardSelected={lastPokemonCardSelected} isOpen={showProfile && !isHandFull} onClose={isMobile ? closeProfile : undefined} />}
            </div>
            {isHandFull && <div className="absolute inset-0 bg-black/60 pointer-events-none md:pointer-events-auto" />}
            <HandBuilder playerHand={playerHand} isHandEmpty={isHandEmpty} showConfirm={isHandFull} showHelp={showHelp} onCardClick={handleCardSelect} onClear={clearHand} onConfirm={handleConfirm} />
            <SelectionPokeballSplash pokeballIsOpen={pokeballIsOpen} disabled={isPokeballDisabled} href={isPokeballDisabled ? null : `${rootPath}/play`} buttonText="Fight!" />
        </div>
    );
}
