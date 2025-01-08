import "../styles/GameModes.css";
import FMode from "../images/friendsMode.svg";
import AMode from "../images/aiMode.svg";
import RMode from "../images/randomMode.svg";
import { useState } from "react";

import GameModePopUp from "../../../components/GameModePopUp/GameModePopUp";
import { useNavigate } from "react-router-dom";

const ModesData = [
    {
        id: 1,
        image: RMode,
        title: "Random Mode",
        text: "Start play with random person",
    },
    {
        id: 2,
        image: AMode,
        title: "Local Mode",
        text: "play in local computer",
    },
    {
        id: 3,
        image: FMode,
        title: "Friends Mode",
        text: "Start play with your friends",
    },
];

function GameModes() {
    const [mode, setMode] = useState<number>(-1);
    const navigator = useNavigate()
    return (
        <>
            <div className="Home-GameModes">
                <h2>Game Modes</h2>
                <div className="Home-GameContents">
                    {ModesData.map((data) => {
                        return (
                            <div className="Home-Mode" key={data.id}>
                                <div>
                                    <h4>{data.title}</h4>
                                    <p>{data.text}</p>
                                    <button
                                        type="submit"
                                        onClick={() => {
                                            setMode(data.id);
                                        }}
                                    >
                                        Start
                                    </button>
                                </div>
                                <div>
                                    <img src={data.image} alt="" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {mode === 3 ? navigator("/game/warmup/friends") : <div style={(mode !== -1 ? {display:"flex"} : {display: "none"})}>
                <GameModePopUp mode={mode} setter={setMode}/>
            </div>}
        </>
    );
}

export default GameModes;
