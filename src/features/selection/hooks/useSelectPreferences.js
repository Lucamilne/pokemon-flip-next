import { useCallback, useEffect, useState } from 'react';

export default function useSelectPreferences({ isMobile, searchString }) {
    const [sortByStrength, setSortByStrength] = useState(() => sessionStorage.getItem('sortByStrength') === 'true');
    const [showProfilesOnMobile, setShowProfilesOnMobile] = useState(() => sessionStorage.getItem('showProfilesOnMobile') !== 'false');
    const [showProfile, setShowProfile] = useState(true);

    useEffect(() => { sessionStorage.setItem('sortByStrength', sortByStrength); }, [sortByStrength]);
    useEffect(() => {
        sessionStorage.setItem('showProfilesOnMobile', showProfilesOnMobile);
        if (!showProfilesOnMobile) setShowProfile(false);
    }, [showProfilesOnMobile]);
    useEffect(() => {
        if (!isMobile) setShowProfile(true);
        else if (searchString.trim()) setShowProfile(false);
    }, [isMobile, searchString]);

    const toggleSort = useCallback(() => setSortByStrength(previous => !previous), []);
    const closeProfile = useCallback(() => setShowProfile(false), []);
    const openProfile = useCallback(() => setShowProfile(true), []);

    return {
        sortByStrength,
        toggleSort,
        showProfilesOnMobile,
        setShowProfilesOnMobile,
        showProfile,
        closeProfile,
        openProfile
    };
}
