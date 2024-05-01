'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { motion, useAnimation } from "framer-motion"
import { Label } from '@/components/ui/label'
import { HexColorPicker } from 'react-colorful'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Divider } from '@nextui-org/divider'
import { axiosQuery } from '@/lib/utils'
import HeaderGame from '@/components/headers/headerGame'

interface Grid {
    id: number
    title: string
    url: string
    createdAt: string
    gridDuration: number
    userId: number
    isActive: number
}

interface User {
    id: number
    username: string
    email: string
}

interface Pixel {
    id: number
    gridId: number
    userId: number
    x: number
    y: number
    color: string
}

export default function GameUrl({ params }: {
    params: {
        url: string
    }
}) {
    const gridSize = 40
    const squareSize = 10
    const [token, setToken] = useState<string | null>(null)
    const [innerWidth, setInnerWidth] = useState(0)
    const [innerHeight, setInnerHeight] = useState(0)
    const [loading, setLoading] = useState(true)
    const controls = useAnimation()
    const [zoomLevel, setZoomLevel] = useState(1)
    const [selectedColor, setSelectedColor] = useState('#aabbcc')
    const [gridObject, setGridObject] = useState<Grid>({ id: 0, title: '', url: '', createdAt: '', gridDuration: 0, userId: 0, isActive: 0})
    const [user, setUser] = useState<User>({ id: 0, username: '', email: '' })
    const [users, setUsers] = useState<String[]>([])
    const [isGridExist, setIsGridExist] = useState<boolean>(false)
    const [ws, setWS] = useState<WebSocket>()
    const [pixels, setPixels] = useState<Pixel[]>([])
    const [pixelColors, setPixelColors] = useState<string[][]>(() => {
        const colors: string[][] = [];
        for (let i = 0; i < gridSize; i++) {
            colors[i] = []
            for (let j = 0; j < gridSize; j++) {
                colors[i][j] = '#ffffff'
            }
        }
        return colors
    })
    const [timeLeft, setTimeLeft] = useState(5555)
    const [canIClick, setCanIClick] = useState(false)
    const [count, setCount] = useState(7);

    const resetCountdown = () => {
        setCount(7)
    }

    const decrementCountdown = async () => {
        if (count > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCount(count - 1);
        }
    }



    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        setToken(storedToken);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setInnerWidth(window.innerWidth);
            setInnerHeight(window.innerHeight);
        }
        window.addEventListener('resize', handleResize)

        handleResize()

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        const getGrid = async () => {
            try {
                const response = await axiosQuery(`/api/grids/url/${params.url}`, 'GET', null, localStorage.getItem('jwtToken'))
                if (response?.data) {
                    setIsGridExist(true)
                    setGridObject(response?.data)
                } else {
                    setIsGridExist(false)
                }
            } catch (error) {
                console.error(error)
                setIsGridExist(false)
            }
        }

        const getMe = async () => {
            try {
                const response = await axiosQuery(`/api/me`, 'GET', null, localStorage.getItem('jwtToken'))
                if (response?.data) {
                    setUser(response.data)
                } else {
                    console.error('Error while getting me')
                }
            } catch (error) {
                console.error(error)
            }
        }

        getGrid()
        getMe()

    }, [params.url])

    useEffect(() => {
        const getPixels = async () => {
            try {
                if (gridObject) {
                    const response = await axiosQuery(`/api/pixels/grid/${gridObject.id}`, 'GET', null, localStorage.getItem('jwtToken'))
                    if (response?.data) {
                        console.log(response.data)
                        setPixels(response.data)
                        setLoading(false)
                    } else {
                        console.error('Error while getting pixels')
                        setLoading(true)
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }

        getPixels()
    }, [gridObject])



    const calculateTimeLeft = useCallback(() => {
        const now = new Date()
        const createdAt = new Date(gridObject.createdAt)
        const duration = gridObject.gridDuration * 60 * 60 * 1000
        const difference = createdAt.getTime() + duration - now.getTime()

        if (difference > 0) {
            setCanIClick(true)
            setTimeLeft(difference)
        } else {
            try {
                console.log('Grid is over')
                axiosQuery(`/api/grids/${gridObject.id}`, 'PUT', { title: gridObject.title, is_active: 0 }, localStorage.getItem('jwtToken'))
            } catch (error) {
                console.error(error)
            }
        }
        return difference
    }, [gridObject.createdAt, gridObject.gridDuration, gridObject.id, gridObject.title])
    useEffect(() => {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft())
            }, 7000) // wait 7 seconds before allowing a new click
            return () => clearInterval(timer)
    }, [calculateTimeLeft, timeLeft])

    const postPixel = async (gridId: number, userId: number, i: number, j: number, color: string): Promise<Pixel> => {
        if (timeLeft > 0 && gridObject.isActive === 1) {
            if (canIClick) {
                try {
                    const response = await axiosQuery(`/api/pixels`, 'POST', { gridId: gridId, userId: userId, x: i, y: j, color: color }, localStorage.getItem('jwtToken'))
                    if (response?.data) {
                        // Historize pixel
                        console.log(gridId, i, j, color)
                        const responseHisto = await axiosQuery(`/api/pixelhistories`, 'POST', { grid_id: gridId, x: i, y: j, color: color }, localStorage.getItem('jwtToken'))
                        if (responseHisto?.data) {
                            console.log(responseHisto.data)
                        } else {
                            console.error('Error while historizing pixel')
                        }

                        //return pixel data
                        return response.data
                    } else {
                        console.error('Error while posting pixel')
                        console.error(response)
                        console.log(gridId, userId, i, j, color)
                        throw new Error('Error while posting pixel')
                    }
                } catch (error) {
                    throw error
                }
            } else {
                return new Promise((resolve, reject) => {
                    reject('You can not click now')
                })
            }
        } else {
            alert('Grid is over, you can not draw anymore')
            return new Promise((resolve, reject) => {
                reject('Grid is over, you can not draw anymore')
            })
        }
    }

    const deletePixel = async (gridId: number, x: number, y: number, color: string) => {
        try {
            const isPixelToDelete = await axiosQuery(`/api/pixels/grid/${x}/${y}/${gridId}`, 'GET', null, localStorage.getItem('jwtToken'))
            if (!isPixelToDelete?.data) {
                return
            }
            const response = await axiosQuery(`/api/pixels/grid/${x}/${y}/${gridId}`, 'DELETE', null, localStorage.getItem('jwtToken'))
            if (response?.data) {
                // console.log(response.data)
            } else {
                console.error('Error while deleting pixel')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleZoom = async () => {
        if (innerHeight > zoomLevel * gridSize * squareSize + innerHeight * 0.2 && innerWidth > zoomLevel * gridSize * squareSize + innerWidth * 0.4) {
            const newZoomLevel = zoomLevel * 1.1
            setZoomLevel(newZoomLevel)
        }

        for(let i = 0; i < gridSize; i++) {
            for(let j = 0; j < gridSize; j++) {
                postPixel(gridObject?.id ?? -1, user.id, i, j, "#0FF000")
                await new Promise(r => setTimeout(r, 10))
            }
        }
    }

    const handleDeZoom = () => {
        if (zoomLevel > 1) {
            const newZoomLevel = zoomLevel * 0.9
            setZoomLevel(newZoomLevel)
        }
    }

    const handlePixelColorChange = (i: number, j: number, newColor: string) => {
        if (timeLeft > 0 && gridObject.isActive === 1) {
            if (canIClick) {
                resetCountdown()
                decrementCountdown()

                const deleteExistingPixel = (i: number, j: number) => {
                    const existingPixelIndex = pixels.findIndex((pixel) => pixel.x === i && pixel.y === j)
                    if (existingPixelIndex !== -1) {
                        const updatedPixels = [...pixels]
                        updatedPixels[existingPixelIndex].color = newColor
                        setPixels(updatedPixels)
                        deletePixel(gridObject?.id ?? -1, i, j, pixelColors[i][j])
                    }
                }

                deleteExistingPixel(i, j)

                const newPixelColors = [...pixelColors]
                newPixelColors[i][j] = newColor
                setPixelColors(newPixelColors)

                const pixelPromise = postPixel(gridObject?.id ?? -1, user.id, i, j, newColor)
                pixelPromise.then((response) => {
                    setPixels([...pixels, {
                        id: response.id,
                        gridId: response.gridId,
                        userId: response.userId,
                        x: response.x,
                        y: response.y,
                        color: response.color
                    }]);
                }).catch((error) => {
                    console.error(error)
                })

                try {
                    ws?.send(JSON.stringify(
                        {
                            newPixel: {
                                x: i,
                                y: j,
                                color: newColor
                            }
                        }
                    ))
                } catch (error) {
                    console.error(error)
                }

                setCanIClick(false)
                setTimeout(() => {
                    setCanIClick(true)
                }, 7000) // rend le nouveau clic possible après 7 secondes
            }
        } else {
            alert('Grid is over, you can not draw anymore')
        }
    }

    const handleColorSelection = (newColor: string) => {
        setSelectedColor(newColor)
    }

    const grid = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (pixels.some(pixel => pixel.x === i && pixel.y === j)) {
                const pixel = pixels.find(pixel => pixel.x === i && pixel.y === j);
                const pixelColor = pixel?.color ?? selectedColor;
                grid.push(
                    <div
                        className="border"
                        key={`${i}-${j}`}
                        style={{
                            width: squareSize,
                            height: squareSize,
                            backgroundColor: pixelColor
                        }}
                        onClick={() => handlePixelColorChange(i, j, selectedColor)}
                    />
                );
            } else {
                grid.push(
                    <div
                        className="border"
                        key={`${i}-${j}`}
                        style={{
                            width: squareSize,
                            height: squareSize,
                            backgroundColor: pixelColors[i][j]
                        }}
                        onClick={() => handlePixelColorChange(i, j, selectedColor)}
                    />
                );
            }
        }
    }



    // Websocket connection
    useEffect(() => {
        setUsers([user.username])

        const userName = user.username.replace(/[^a-zA-Z0-9_-]/g, '_')
        const ws = new WebSocket(`ws://34.155.216.217:80/ws?url=${params.url}&user_name=${userName}`)
        setWS(ws)

        ws.onmessage = function (event) {
            try {
                const data = JSON.parse(event.data)

                if (data.newPixel) {
                    const { x, y, color } = data.newPixel
                    // Update the pixel color in the state
                    setPixels(pixels => pixels.map(pixel => {
                        if (pixel.x === x && pixel.y === y) {
                            // If the pixel exists, update its color
                            return { ...pixel, color }
                        }
                        return pixel // Return the pixel unchanged if it doesn't match
                    }));

                    // Also update the pixelColors state to reflect the change
                    setPixelColors(pixelColors => {
                        const updatedPixelColors = [...pixelColors]
                        updatedPixelColors[x][y] = color
                        return updatedPixelColors
                    })
                }
                if (data.type && data.type === 'playerList') {
                    if (data.players) {
                        const players = data.players
                        players.splice(players.indexOf(userName), 1)
                        setUsers(data.players)
                    }
                }

                if (data.PlayerDisconnected) {
                    setUsers(users => users.filter((user) => user !== data.PlayerDisconnected))
                }
            } catch (error) {
                // Raw message
                console.log(event.data)
            }
        }
    }, [user, pixels, params.url])

    useEffect(() => {
        const handleWheel = (event: any) => {
            if (event.deltaY < 0 && (innerHeight > zoomLevel * gridSize * squareSize + innerHeight * 0.2 && innerWidth > zoomLevel * gridSize * squareSize + innerWidth * 0.4)) {
                const newZoomLevel = zoomLevel * 1.1
                setZoomLevel(newZoomLevel)
            } else if (event.deltaY > 0 && zoomLevel > 1) {
                const newZoomLevel = zoomLevel * 0.9
                setZoomLevel(newZoomLevel)
            }
        }

        window.addEventListener('wheel', handleWheel)
        return () => window.removeEventListener('wheel', handleWheel)
    }, [innerHeight, innerWidth, zoomLevel])

    useEffect(() => {
        controls.start({ scale: zoomLevel })
    }, [zoomLevel, controls])


    return (
        <>
        {loading ? (
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'>
                <Label className='text-4xl font-bold mb-5'>Loading...</Label>
                <Label>Please wait for grid to be set</Label>
            </div>
        ) : !token ? (
                    <div className="flex flex-col min-h-screen items-center justify-center">
                        <h1 className="text-4xl font-bold">Please log in to access this page</h1>
                        <Button className="mt-4" onClick={(e:any) => {window.location.href = '/user'}}>Log In</Button>
                    </div>
                ) : !isGridExist ? (
                    <div className="flex flex-col min-h-screen items-center justify-center">
                        <h1 className="text-4xl font-bold">{`The page you want to access doesn't exist.`}</h1>
                        <Button className="mt-4" onClick={(e: any) => { window.location.href = '/game_dashboard' }}>Go to lobbies dashboard</Button>
                    </div>
                ) : (
                <>
                    <HeaderGame id={gridObject?.id} createdAt={gridObject?.createdAt} gridDuration={gridObject?.gridDuration} />
                    <div className='relative z-0 h-[100vh] w-[100vw] overflow-hidden'>
                        <div className='absolute top-[22%] flex flex-col text-center transform -translate-x-1/2 gap-4'
                            style={{ left: `${innerWidth / 2 - 175}px` }}>
                            <Label
                                className='text-lg'
                                dangerouslySetInnerHTML={{ __html: `You can zoom using buttons below <br/> or your mouse's wheel!` }}>
                            </Label>
                            <Label className='text-gray-400'>
                                You can only put one pixel every 7 seconds
                            </Label>
                        </div>

                        <Label className='absolute top-1/2 left-[20px] transform -transform-y-1/2 text-xl'>
                            Please wait 7 seconds before start drawing
                        </Label>
                        
                        <div className='absolute top-[55%] transform -translate-x-1/2 -translate-y-1/2' style={{ left: `${innerWidth / 2 - 175}px` }}>
                            <motion.div
                                className='grid-container relative'
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    width: `${gridSize * squareSize}px`,
                                    height: `${gridSize * squareSize}px`
                                }}
                                animate={controls}
                            >
                                {grid}
                            </motion.div>
                        </div>
                        <div>
                            <Button
                                style={{
                                    position: 'absolute',
                                    bottom: '0%',
                                    marginBottom: '20px',
                                    left: '20px',
                                    zIndex: 10,
                                }}
                                onClick={handleZoom}
                            >
                                Zoom In
                            </Button>
                            <Button
                                style={{
                                    position: 'absolute',
                                    bottom: '0%',
                                    left: '120px',
                                    marginBottom: '20px',
                                    zIndex: 10,
                                }}
                                onClick={handleDeZoom}
                            >
                                <p>Zoom Out</p>
                            </Button>
                        </div>
                        <section className='absolute h-[100vh] z-[100] right-0 w-[350px]'>
                            <Card className='relative top-[0px] flex flex-col' style={{ borderRadius: '0px', height: `${innerHeight - 300}px` }}>
                                <CardHeader>
                                    <CardTitle>{gridObject?.title}</CardTitle>
                                </CardHeader>
                                <Divider className='mb-5' />
                                <CardContent className='flex-grow'>
                                    <CardHeader>
                                        <Label className='text-lg'>Users connected:</Label>
                                        <Divider />
                                    </CardHeader>
                                    <CardContent className='flex flex-col gap-10 overflow-y-auto ml-3' style={{ maxHeight: `${innerHeight - 500}px` }}>
                                        <Label>◉ {user.username}</Label>
                                        {users.map((user, index) => (
                                            <Label key={index}>◉ {user}</Label>
                                        ))}
                                    </CardContent>
                                </CardContent>
                            </Card>
                            <Card className='absolute bottom-0 flex flex-col w-full h-[300px]' style={{ borderRadius: '0px' }}>
                                <CardFooter className='relative flex flex-col m-0 p-0 top-1/2 transform -translate-y-1/2'>
                                    <Label>Selected color:</Label>
                                    {selectedColor}
                                    <HexColorPicker color={selectedColor} onChange={handleColorSelection} />
                                </CardFooter>
                            </Card>
                        </section>
                    </div>
                </>
            )}
        </>
    )
}
