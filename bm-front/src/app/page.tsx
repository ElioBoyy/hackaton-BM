'use client'

import HeaderHomepage from "@/components/headers/headerHomepage";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    setToken(token)
  } , [])

  const handleClick = () => {
    if (token) {
      window.location.href = "/game_dashboard";
    } else {
      window.location.href = "/user";
    }
  }

  return (
    <>
      <HeaderHomepage />
      <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <Label className="lg:text-7xl md:text-5xl sm:text-3xl">r/Place</Label>
          <Label className="lg:text-9xl md:text-7xl sm:text-5xl py-8"><span className="font-thin">Black</span><span className="font-semibold">motion</span></Label>
        </div>
        <Button onClick={handleClick} className="w-fit p-12 lg:text-5xl md:text-4xl sm:text-3xl mt-4">Play</Button>
      </section>
    </>
  );
}
