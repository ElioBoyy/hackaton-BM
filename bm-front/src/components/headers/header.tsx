'use client'

import { Divider } from "@nextui-org/divider";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import Image from 'next/image';
import backward from "../../../public/backward-solid.svg";
import Timer from "../Timer";

interface Grid {
    id: number
    createdAt: string
    gridDuration: number
}

export default function Header({ id, createdAt, gridDuration }: Grid) {
    const [innerWidth, setInnerWidth] = useState(window.innerWidth)

    useEffect(() => {
        window.addEventListener('resize', () => {
            setInnerWidth(window.innerWidth)
        })
    }, [])

    return (
        <header className='absolute w-full z-50' style={{width: `${innerWidth - 350}px`}}>
            <div className='flex h-[73px] items-center justify-between py-4 px-6'>
                <div className='flex items-center gap-5'>
                    <Button className='cursor-pointer' size="sm" variant="secondary" onClick={(e:any) => {window.location.href = '/game_dashboard'}} >
                        <Image src={backward} alt="Back" width={20} height={20} />
                    </Button>
                    <h1 className="text-2xl font-bold">Game</h1>
                </div>
                <div className='absolute left-1/2 top-[30%] transform -translate-x-1/2'>
                    <Timer created_at={createdAt} grid_duration={gridDuration} grid_id={id} classProps='text-black text-2xl' />
                </div>
            </div>
            <Divider />  
        </header>
    )
}