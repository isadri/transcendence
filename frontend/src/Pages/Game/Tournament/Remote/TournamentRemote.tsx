import TournamentWarmUp from "./Components/WarmUp/TournamentWarmUp"


type TournamentRemote = {
  isRanom?: boolean;
}



const TournamentRemote = ({ isRanom = true }: TournamentRemote) => {
  return (
    <>
      <TournamentWarmUp isRandom={isRanom} />
    </>
  )
}

export default TournamentRemote