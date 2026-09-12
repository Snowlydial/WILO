import './SearchBar.css'

interface SearchBarProps {
    onClick: () => void;
}

export default function SearchBar({ onClick }: SearchBarProps) {
    return (
        <>
            <button className="search-bar" onClick={onClick}>
                <img src="/icons/magnifying-glass.svg" alt="search" />
                <span>Rechercher une note</span>
            </button>
        </>
    )
}