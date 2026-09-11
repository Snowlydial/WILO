import './SearchNav.css'

interface SearchNavProps {
    query: string;
    onQueryChange: (value: string) => void;
}

export default function SearchNav({ query, onQueryChange }: SearchNavProps) {
    return (
        <nav>
            <span className="logo">Logo</span>
            <div className="nav-right">
                <input
                    className="search-input"
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Rechercher une note"
                />
                <button>
                    <img src="/icons/bell.svg" alt="notification" />
                </button>
            </div>
        </nav>
    )
}