import './SearchBar.css'

export default function SearchBar() {
    return (
        <>
            <button className="search-bar">
                <img src="/icons/magnifying-glass.svg" alt="search" />
                <span>Rechercher une note</span>
            </button>
        </>
    )
}