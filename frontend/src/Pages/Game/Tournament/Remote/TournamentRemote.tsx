import { useParams } from "react-router-dom";
import TournamentGames from "./Components/TournamentGames/TournamentGames";
import TournamentWarmUp from "./Components/WarmUp/TournamentWarmUp"


type TournamentRemote = {
  isRandom?: boolean,
  ready?: boolean;
}



const TournamentRemote = ({ isRandom = true, ready = false }: TournamentRemote) => {
  const {id} = useParams(); // protect later
  return (
    <>
      {
        !ready?
          <TournamentWarmUp isRandom={isRandom} />
          :
          <TournamentGames tournament={id}/>
      }
    </>
  )
}

export default TournamentRemote