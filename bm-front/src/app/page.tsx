'use client'

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";

export default function Home() {
  const token = localStorage.getItem('jwtToken');
  const handleClick = () => {
    if (token) {
      window.location.href = "/game_dashboard";
    } else {
      window.location.href = "/user";
    }
  }

  return (
    <>
      <section className="absolute">
        <Label>Play the game</Label>
        <Card>
          <Button onClick={handleClick} className="w-[160px] h-[80px] text-5xl">Play</Button>
        </Card>
      </section>
    </>
  );
}
