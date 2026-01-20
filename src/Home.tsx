import 'bootstrap/dist/css/bootstrap.min.css';
import matches from "./matches.json"
import wins from "./wins.json"
import {useState} from "react";
import {Link} from "react-router-dom";

type WinEntry = {
    name: string;
    wins: number;
    elo: number;
};

const typedWins = wins as WinEntry[];


function Home() {
    const [filter, setFilter] = useState("");

    const onSelectFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
    }

    return (
        <div>
            <div className={"container"}>
                <h2>Leader Bots</h2>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Wins</th>
                            <th>ELO Score</th>
                        </tr>
                        </thead>
                        <tbody>
                        {typedWins.sort(a => a.elo).reverse().map((winner,i) => (
                            <tr>
                                <td>#{i+1}</td>
                                <td>{winner.name}</td>
                                <td>{winner.wins }</td>
                                <td>{winner.elo }</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                <h2>Matches</h2>

                <div>
                    filter:
                    <select className={"form-control"} onChange={onSelectFilter}>
                        <option value={""}>None</option>
                        {wins.sort(a => a.elo).reverse().map((winner) => (
                            <option value={winner.name} >{winner.name}</option>
                        ))}
                    </select>
                </div>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Winner</th>
                    </tr>
                    </thead>
                    <tbody>
                        {matches.filter(match => (!filter || match.A === filter || match.B === filter)).map((match,i) => (
                            <tr>
                                <td>{i}</td>
                                <td><Link to={`/${match.name}`} >{match.A} vs {match.B}</Link></td>
                                <td>{match.winner === "A"? match.A : (match.winner === "B" ? match.B : "draw")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default Home
