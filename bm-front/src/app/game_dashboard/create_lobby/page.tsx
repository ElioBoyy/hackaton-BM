'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { axiosQuery } from '@/lib/utils'
import { Divider } from '@nextui-org/divider'
import React, { useState } from 'react'

export default function CreateLobby() {
    const [ lobbyName, setLobbyName ] = useState('')
    const [ lobbyDuration , setLobbyDuration ] = useState(3)

    const postGrid = async (lobbyName : string, lobbyDuration : number) => {
        const response = await axiosQuery('/api/grids', 'POST', { title: lobbyName, grid_duration: lobbyDuration })
        if (response) {
            console.log(response)
        } else {
            console.error('Error while posting')
        }
    };

    const handleCreateLobby = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        postGrid(lobbyName, lobbyDuration)
    };

    const handleUser = () => {
        window.location.href = '/user'
    }

    return (
        <>
        {!localStorage.getItem('jwtToken') ? (
                <div className="flex flex-col min-h-screen items-center justify-center">
                    <h1 className="text-4xl font-bold">Please log in to view this page</h1>
                    <Button className="mt-4" onClick={handleUser}>Log In</Button>
                </div>
            ) : (
                <div className='w-[500px] absolute top-[20%] left-[50%]' style={{transform: 'translate(-50%)'}}>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-center'>
                                Create a new lobby
                            </CardTitle>
                        </CardHeader>
                        <Divider />
                        <CardContent className='mt-5'>
                            <div className='space-y-1'>
                                <Label>Lobby name</Label>
                                <Input placeholder='CoolLobbyName' onChange={(e : any) => setLobbyName(e.target.value)}/>
                            </div>
                            <div className='space-y-1'>
                                <Label>Lobby duration <span className='italic'>(hours)</span></Label>
                                <Input
                                    type="number"
                                    defaultValue="3"
                                    placeholder="3"
                                    step="1"
                                    max={12}
                                    min={1}
                                    onChange={(e : any) => setLobbyDuration(e.target.value)}
                                />
                            </div>
                            <div className='mt-5'>
                                <Button onClick={handleCreateLobby}>Create a lobby</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}