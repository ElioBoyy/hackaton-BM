'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { motion, useAnimation } from "framer-motion"
import { Label } from '@/components/ui/label'
import { HexColorPicker } from 'react-colorful'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Divider } from '@nextui-org/divider'
import { axiosQuery } from '@/lib/utils'

interface Grid {
    id: number
    title: string
    url: string
    createdAt: string
    gridDuration: number
    userId: number
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
    const [loading, setLoading] = useState(true)
    const controls = useAnimation()
    const [zoomLevel, setZoomLevel] = useState(1)
    const [selectedColor, setSelectedColor] = useState('#aabbcc')
    const [gridObject, setGridObject] = useState<Grid | undefined>()
    const [user, setUser] = useState<User>({id: 0, username: '', email: ''})
    const [isGridExist, setIsGridExist] = useState<boolean>(false)
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



    const postPixel = async (gridId : number, userId: number, i: number, j: number, color: string) : Promise<Pixel> => {
        try {            
            const response = await axiosQuery(`/api/pixels`, 'POST', { gridId: gridId, userId: userId, x: i, y: j, color: color }, localStorage.getItem('jwtToken'))
            if (response?.data) {
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
    }

    const deletePixelAndHisto = async (gridId: number, x: number, y: number, color: string) => {
        try {
            const response = await axiosQuery(`/api/pixels/grid/${x}/${y}/${gridId}`, 'DELETE', null, localStorage.getItem('jwtToken'))
            if (response?.data) {
                console.log(response.data)
            } else {
                console.error('Error while deleting pixel')
            }

            // Historize pixel
            console.log(gridId, x, y, color)
            const responseHisto = await axiosQuery(`/api/pixelhistories`, 'POST', { grid_id: gridId, x: x, y: y, color: color }, localStorage.getItem('jwtToken'))
            if (responseHisto?.data) {
                console.log(responseHisto.data)
            } else {
                console.error('Error while historizing pixel')
            }
        } catch (error) {
            console.error(error)
        }
    }



    const handleZoom = () => {
        if (innerHeight > zoomLevel * gridSize * squareSize + innerHeight * 0.2 && innerWidth > zoomLevel * gridSize * squareSize + innerWidth * 0.4) {
            const newZoomLevel = zoomLevel * 1.1
            setZoomLevel(newZoomLevel)
        }
    }

    const handleDeZoom = () => {
        if (zoomLevel > 1) {
            const newZoomLevel = zoomLevel * 0.9
            setZoomLevel(newZoomLevel)
        }
    }

    const handlePixelColorChange = (i: number, j: number, newColor: string) => {
        const deleteExistingPixel = (i: number, j: number) => {
            const existingPixelIndex = pixels.findIndex((pixel) => pixel.x === i && pixel.y === j);
            if (existingPixelIndex !== -1) {
                const updatedPixels = [...pixels];
                updatedPixels.splice(existingPixelIndex, 1);
                setPixels(updatedPixels);
                deletePixelAndHisto(gridObject?.id ?? -1, i, j, pixelColors[i][j]);
            }
        };

        deleteExistingPixel(i, j);

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
            console.log(response)
        }).catch((error) => {
            console.error(error);
        });
    }

    const handleColorSelection = (newColor: string) => {
        setSelectedColor(newColor)
    }



    // Websocket connection
    useEffect(() => {
        const userName = user.username.replace(/[^a-zA-Z0-9_-]/g, '_')
        const ws = new WebSocket(`ws://localhost:3334?url=${params.url}&user_name=${userName}`)
        ws.onopen = () => {
            console.log('Connected to WS')
            ws.send(JSON.stringify(
                {
                    x: 2,
                    y: 9,
                    color: '#112233'
                }
            ))
        }
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
        }
    }, [user])



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
    }, [zoomLevel])

    useEffect(() => {
        controls.start({ scale: zoomLevel })
    }, [zoomLevel, controls])


    return (
        <>
        {loading ? (
            isGridExist ? (
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'>
                    <Label className='text-4xl font-bold mb-5'>Loading...</Label>
                    <Label>Please wait for grid to be set</Label>
                </div>
            ) : (
                <div className="flex flex-col min-h-screen items-center justify-center">
                    <h1 className="text-4xl font-bold">{`The page you want to access doesn't exist.`}</h1>
                    <Button className="mt-4" onClick={(e:any) => {window.location.href = '/game_dashboard'}}>Go to lobbies dashboard</Button>
                </div>
            )
        ) : (
            <div className='relative h-[100vh] w-[100vw] overflow-hidden'>
                <Label
                    className='absolute top-[22%] flex text-center text-lg transform -translate-x-1/2'
                    style={{left: `${innerWidth / 2 - 175}px`}}
                    dangerouslySetInnerHTML={{__html: `You can zoom using buttons below <br/> or your mouse's wheel!`}}>
                </Label>
                <div className='absolute top-[55%] transform -translate-x-1/2 -translate-y-1/2' style={{left: `${innerWidth / 2 - 175}px` }}>
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
                <section className='absolute z-[100] right-0 w-[350px]'>
                    <Card className='h-[100vh] flex flex-col' style={{borderRadius: '0px'}}>
                        <CardHeader>
                            <CardTitle>{gridObject?.title}</CardTitle>
                        </CardHeader>
                        <Divider className='mb-5'/>
                        <CardContent className='flex-grow'>
                            <CardHeader>
                                <Label className='text-lg'>Users connected:</Label>
                                <Divider />
                            </CardHeader>
                            <CardContent className='flex flex-col max-h-[49vh] gap-20 overflow-y-auto'>
                                {/* Users list */}
                            </CardContent>
                            <Divider />
                        </CardContent>
                        <Divider className='mb-5'/>
                    </Card>
                    <Card className='absolute bottom-0 flex flex-col w-full h-[300px]' style={{borderRadius: '0px'}}>
                        <CardFooter className='relative flex flex-col m-0 p-0 top-1/2 transform -translate-y-1/2'>
                            <Label>Selected color:</Label>
                            {selectedColor}
                            <HexColorPicker color={selectedColor} onChange={handleColorSelection} />
                        </CardFooter>
                    </Card>
                </section>
            </div>
            )}
        </>
    )
}
