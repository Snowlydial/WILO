import LogCard from "./components/log/LogCard"
import DayCard from "./components/ui/day-card/DayCard"
import MonthYearSelector from "./components/ui/month-year-selector/MonthYearSelector"

function App() {
  return (
    <>
      <MonthYearSelector selectedMonth={0} selectedYear={2026}></MonthYearSelector>
      <DayCard date={"XX"} status="Status"/>
      <LogCard></LogCard>
    </>
  )
}

export default App
