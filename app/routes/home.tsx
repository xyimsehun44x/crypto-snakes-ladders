import type { Route } from "./+types/home";
import { SnakesAndLaddersGame } from "../components/SnakesAndLaddersGame";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Crypto Snakes & Ladders" },
    { name: "description", content: "Play Snakes & Ladders on the blockchain!" },
  ];
}

export default function Home() {
  return <SnakesAndLaddersGame />;
}
