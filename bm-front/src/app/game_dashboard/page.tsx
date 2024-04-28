'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { axiosQuery } from '@/lib/utils'
import { Divider } from '@nextui-org/divider'
import React, { useEffect, useState } from 'react'

export default function GameDashboard() {
    const [grids, setGrids] = useState([]);

    const getGrids = async () => {
        const response = await axiosQuery('/api/grids', 'GET', null)
        if (response?.data) {
            setGrids(response?.data)
        } else {
            console.error('Error while fetching')
        }
    };

    const handleCreateLobby = () => {
        window.location.href = "/game_dashboard/create_lobby"
    }

    const handleUser = () => {
        window.location.href = "/user"
    }

    useEffect(() => {
        getGrids();
    }, []);

    return (
        <>
            {!localStorage.getItem('jwtToken') ? (
                <div className="flex flex-col min-h-screen items-center justify-center">
                    <h1 className="text-4xl font-bold">Please log in to view this page</h1>
                    <Button className="mt-4" onClick={handleUser}>Log In</Button>
                </div>
            ) : (
                <div className="flex flex-col min-h-screen">
                    <header className="bg-color-background text-color-primary py-4 px-6 flex items-center justify-between">
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
                            <Button size="sm" className='primary-foreground' onClick={handleCreateLobby} >
                                Create Lobby
                            </Button>
                            <Divider orientation='vertical'/>
                            <Button size="sm" variant="secondary" onClick={handleUser} >
                                Profile
                            </Button>
                        </div>
                    </header>
                    <Divider />
                    <main className="flex-1 bg-color-background dark:bg-gray-900 p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-[60vw] mx-auto">
                            {grids.map((grid, index) => (
                                <Card key={index}>
                                    <div className="relative h-32 overflow-hidden rounded-t-md">
                                        <img
                                            alt="Lobby Thumbnail"
                                            className="w-full h-full object-cover aspect-square"
                                            height={400}
                                            src="/placeholder.svg"
                                            width={400}
                                        />
                                    </div>
                                    <div className="p-4 bg-secondary dark:bg-gray-800 rounded-b-md">
                                        <h3 className="text-lg font-medium mb-2 flex">{grid.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">4 players</span>
                                            <Button size="sm" variant="outline" onClick={(e : any) => window.location.href = '/game/' + grid.url}>
                                                Join
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
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