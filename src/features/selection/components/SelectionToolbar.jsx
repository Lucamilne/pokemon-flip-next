import { memo } from 'react';
import SearchControls from './SearchControls.jsx';

const helperTextCharacters = 'Choose your hand!'.split('');

const SelectionToolbar = memo(function SelectionToolbar(props) {
    return <div className="px-7 py-4 md:pb-6 flex justify-between gap-4 items-center hand-top-container pb-7 md:pb-8"><SearchControls {...props} /><h1 className="hidden md:block text-right header-text text-xl lg:text-2xl text-hop">{helperTextCharacters.map((char, index) => <span key={index} style={{ animationDelay: `${(index + 1) * 50}ms` }}>{char}</span>)}</h1></div>;
});

export default SelectionToolbar;
