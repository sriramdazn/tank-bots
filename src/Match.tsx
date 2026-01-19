import {useCallback, useEffect, useRef, useState} from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { isObjectPosition } from './util.js';
import './App.css'
import {useParams} from "react-router-dom";

const STAGE_SIZE = 8;

type ObjectData = {
    position: [number, number];
    direction?: number;
    type?: string;
    diamonds?: number;
    bullets?: number;
    shooting?: boolean;
    destroyed?: boolean;
    visible?: boolean;
}

type RoundDataType = {
    playerA: ObjectData,
    playerB: ObjectData,
    diamond: ObjectData,
    bullet: ObjectData,
}

function Match() {
    const [gameData , setGameData] = useState<RoundDataType[]>();
    const [round, setRound] = useState(0);
    const [roundData, setRoundData] = useState<RoundDataType>();

    const timer = useRef<number>(0);

    const { id } = useParams();

    useEffect(() => {
        (async () => {
            if (id) {
                const data = (await import(`./matches/${id}.json`)).default;
                setGameData(data);
            }else{
                const data = (await import("./match.json")).default;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                setGameData(data);
            }
        })();
    }, [id]);

    const playRound = useCallback(function(){

        if (!gameData) return;

        if (round >= gameData.length){
            clearInterval(timer.current);
            return;
        }
        const data  = gameData[round];

        setRoundData({
            playerA: data.playerA,
            playerB: data.playerB,
            diamond: data.diamond,
            bullet: data.bullet,
        });

    }, [gameData, round]);

    useEffect(() => {
        if (!gameData || gameData.length <= 0) return;
        console.log("gameData", gameData);

        if (round >= gameData.length){
            return;
        }

        timer.current = setInterval(function(){
            playRound();
            setRound((round) => round+1);
            console.log("round", round);

        }, 1000)

        return () => {
            clearInterval(timer.current);
        }
    }, [gameData, playRound, round]);



    const renderObjects = (x:number,y:number) => {

        if (!roundData) return;

        if (isObjectPosition(roundData.playerA, x, y)) {
            const classes = ["player", "playerA",
                roundData.playerA.direction,
                roundData.playerA.shooting ? "shooting" : "",
                roundData.playerA.destroyed ? "destroyed" : "",
            ];

            return (
                <div className={classes.join(" ")} ></div>
            )
        }

        if (isObjectPosition(roundData.playerB, x, y)) {
            const classes = ["player", "playerB",
                roundData.playerB.direction,
                roundData.playerB.shooting ? "shooting" : "",
                roundData.playerB.destroyed ? "destroyed" : ""
            ];

            return (
                <div className={classes.join(" ")} ></div>
            )
        }

        if (isObjectPosition(roundData.diamond, x, y) && roundData.diamond.visible) {
            const classes = ["diamond"];

            return (
                <div className={classes.join(" ")} ></div>
            )
        }

        if (isObjectPosition(roundData.bullet, x, y) && roundData.bullet.visible) {
            const classes = ["bullet"];

            return (
                <div className={classes.join(" ")} ></div>
            )
        }

    }


  return (
      <div>
            <div className="arena">
                {[...Array(STAGE_SIZE).keys()].map((y => (
                    <div className={"row"}>
                        {[...Array(STAGE_SIZE).keys()].map((x => (
                            <div className={"cell"}>
                                {/*<div className={"info"}> {x},{y}</div>*/}
                                {renderObjects(x,y)}
                            </div>
                        )))}
                    </div>
                )))}

            </div>
          <div className="round-number">{round}</div>
          {/*<div className="game-message" >{game.message}</div>*/}
      </div>
  )
}

export default Match
