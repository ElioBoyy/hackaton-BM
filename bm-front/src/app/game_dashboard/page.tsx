'use client'

import GameCreatorLabel from '@/components/GameCreatorLabel'
import Timer from '@/components/Timer'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { axiosQuery } from '@/lib/utils'
import { Divider } from '@nextui-org/divider'
import React, { useEffect, useState } from 'react'

interface Grid {
    id: number
    title: string
    url: string
    createdAt: string
    gridDuration: number
    userId: number
}

export default function GameDashboard() {
    const [token, setToken] = useState<string | null>(null)
    const [grids, setGrids] = useState<Grid[]>([])
    const [ws, setWS] = useState<WebSocket | null>(null)



    useEffect(() => {
        const token = localStorage.getItem('jwtToken')
        setToken(token)
    } , [])

    useEffect(() => {
        const getGrids = async () => {
            const response = await axiosQuery('/api/grids', 'GET', null, localStorage.getItem('jwtToken'))
            if (response?.data) {
                setGrids(response?.data)
            } else {
                console.error('Error while fetching')
            }
        }

        getGrids()
    }, [])



    const onTimeUp = () => {
        console.log('Time\'s up!')
    }


    
    return (
        <>
            {!token ? (
                <div className="flex flex-col min-h-screen items-center justify-center">
                    <h1 className="text-4xl font-bold">Please log in to access this page</h1>
                    <Button className="mt-4" onClick={(e:any) => {window.location.href = '/user'}}>Log In</Button>
                </div>
            ) : (
                <div className="flex flex-col min-h-screen">
                    <header className="bg-color-background text-color-primary">
                        <div className='flex items-center justify-between py-4 px-6'>
                            <h1 className="text-2xl font-bold">Game Lobbies</h1>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <Input
                                    className="bg-secondary rounded-md pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder="Search lobbies..."
                                    type="text"
                                    />
                                </div>
                                <Button size="sm" className='primary-foreground' onClick={(e:any) => {window.location.href = '/game_dashboard/create_lobby'}} >
                                    Create Lobby
                                </Button>
                                <Divider orientation='vertical'/>
                                <Button size="sm" variant="secondary" onClick={(e:any) => {window.location.href = '/user'}} >
                                    Profile
                                </Button>
                            </div>
                        </div>
                        <Divider />
                    </header>
                    
                    <main className="flex-1 bg-color-background p-6">
                        <div className='gap-6 md:max-w-[70vw] lg:max-w-[60vw] mx-auto'>
                            <div className='flex flex-wrap justify-center gap-5'>
                                {grids.map((grid, index) => (
                                    <Card key={index} className='bg-secondary w-[300px] min-w-[300px] max-w-[300px]'>
                                        <div className="my-3 p-4 rounded-b-md">
                                            <CardTitle className="text-lg font-medium mb-2 flex">{grid.title}</CardTitle>
                                            <div className="flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <GameCreatorLabel user_id={grid.userId} />
                                                    <span className="text-gray-500">0 players</span>
                                                    <Timer created_at={grid.createdAt} grid_duration={grid.gridDuration} grid_id={grid.id} classProps='' />
                                                </div>
                                                <Button size="sm" variant="outline" onClick={(e : any) => window.location.href = `/game/${grid.url}`}>
                                                    Join
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                <div className='w-[300px] min-w-[300px] max-w-[300px] h-[166px]'></div>
                            </div>
                        </div>
                    </main>
                </div>
            )}
        </>
    )
}

function SearchIcon(props : any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    )
  }