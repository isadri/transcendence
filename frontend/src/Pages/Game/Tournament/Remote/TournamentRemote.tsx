import TournamentGames from "./Components/TournamentGames/TournamentGames";
import TournamentWarmUp from "./Components/WarmUp/TournamentWarmUp"


type TournamentRemote = {
  isRandom?: boolean,
  ready?: boolean;
}



const TournamentRemote = ({ isRandom = true, ready = false }: TournamentRemote) => {
  return (
    <>
      {
        !ready?
          <TournamentWarmUp isRandom={isRandom} />
          :
          <>hello</>
      }
    </>
  )
}

export default TournamentRemote