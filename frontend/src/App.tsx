import LogCard from "./components/log/LogCard"
import DateSelector from "./components/ui/date-selector/DateSelector"
import SearchNav from "./components/ui/search-nav/SearchNav"

function App() {
  return (
    <>
      <SearchNav></SearchNav>
      <DateSelector></DateSelector>
      <LogCard></LogCard>
    </>
  )
}

export default App
