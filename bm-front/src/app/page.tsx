'use client'

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";

export default function Home() {
  const handleClick = () => {
    if (localStorage.getItem("token")) {
      console.log("Redirect to the game page");
    } else {
      window.location.href = "/user";
    }
  }

  return (
    <>
      <section className="absolute">
        <CardTitle>HelloWorld</CardTitle>
        <Card>
          <Button onClick={handleClick} className="w-[160px] h-[80px] text-5xl">Play</Button>
        </Card>
      </section>
    </>
  );
}
