import LogCard from "./components/log/LogCard"
import DateSelector from "./components/ui/date-selector/DateSelector"
import SearchBar from "./components/ui/search-bar/SearchBar"

function App() {
  return (
    <>
      <SearchBar></SearchBar>
      <DateSelector></DateSelector>
      <LogCard></LogCard>
    </>
  )
}

export default App
