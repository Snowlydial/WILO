import './SearchNav.css'
import SearchBar from "../search-bar/SearchBar"

export default function SearchNav() {
    return (
        <nav>
            <span className="logo">Logo</span>
            <div className="nav-right">
                <SearchBar></SearchBar>
                <button>
                    <img src="/icons/bell.svg" alt="notification" />
                </button>
            </div>
        </nav>
    )
} 