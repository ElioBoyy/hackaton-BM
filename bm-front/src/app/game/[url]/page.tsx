'use client';

import React, { use, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from "framer-motion";
import { Label } from '@/components/ui/label';
import { HexColorPicker } from 'react-colorful';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Divider } from '@nextui-org/divider';
import { axiosQuery } from '@/lib/utils';

interface Grid {
    title: string
    url: string
    createdAt: string
    gridDuration: number
    userId: number
}

export default function GameUrl({ params }: {
    params: {
        url: string
    }
}) {
    const gridSize = 40
    const squareSize = 10
    const controls = useAnimation()
    const [zoomLevel, setZoomLevel] = useState(1)
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
    const [selectedColor, setSelectedColor] = useState('#aabbcc')
    const [gridObject, setGridObject] = useState<Grid>()

    const handleZoom = () => {
        if (innerHeight > zoomLevel * gridSize * squareSize + innerHeight * 0.2) {
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
        const newPixelColors = [...pixelColors]
        newPixelColors[i][j] = newColor
        setPixelColors(newPixelColors)
    }

    const handleColorSelection = (newColor: string) => {
        setSelectedColor(newColor)
    }

    const getGrid = async () => {
        const response = await axiosQuery(`/api/grids/url/${params.url}`, 'GET', null, localStorage.getItem('jwtToken'))
        if (response?.data) {
            setGridObject(response?.data)
        } else {
            console.error('Error while fetching')
        }
    }
    useEffect(() => {
        getGrid()
    }, [])

    useEffect(() => {
        const handleWheel = (event: any) => {
            if (event.deltaY < 0 && innerHeight > zoomLevel * gridSize * squareSize + innerHeight * 0.2) {
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

    const grid = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
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
            )
        }
    }

    return (
        <>
            <div className='relative h-[100vh] w-[100vw] overflow-hidden'>
                <Label className='absolute left-1/2 top-[22%] flex text-center text-lg' style={{transform: 'translate(-50%)'}}>
                    You can zoom using buttons below <br/> or your mouse's wheel!
                </Label>
                <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)' }}>
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
                <section className='absolute z-[100] right-0 w-[20vw]'>
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
                        <CardFooter className='flex flex-col'>
                            <Label>Select a color:</Label>
                            {selectedColor}
                            <HexColorPicker color={selectedColor} onChange={handleColorSelection} />
                        </CardFooter>
                    </Card>
                </section>
            </div>
        </>
    );
}
