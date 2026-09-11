import './SearchNav.css'
import SearchBar from "../search-bar/SearchBar"

interface SearchNavProps {
    onSearchClick: () => void;
}

export default function SearchNav({ onSearchClick }: SearchNavProps) {
    return (
        <nav>
            <span className="logo">Logo</span>
            <div className="nav-right">
                <SearchBar onClick={onSearchClick} />
                <button>
                    <img src="/icons/bell.svg" alt="notification" />
                </button>
            </div>
        </nav>
    )
} 