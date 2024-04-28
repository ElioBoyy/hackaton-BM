'use client'

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "./ui/button";

export default function Grid() {
    const gridSize = 40
    const squareSize = 10
    const controls = useAnimation()
    const [zoomLevel, setZoomLevel] = useState(1)

    const handleZoom = () => {
        if (zoomLevel < 8) {
            const newZoomLevel = zoomLevel + 0.2
            setZoomLevel(newZoomLevel);
        }
    };

    const handleDeZoom = () => {
        if (zoomLevel > 1) {
            const newZoomLevel = zoomLevel - 0.2
            setZoomLevel(newZoomLevel);
        }
    };

    useEffect(() => {
        controls.start({ scale: zoomLevel });
    }, [zoomLevel, controls]);
   
    const grid = []
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid.push(
            <div
                className="border"
                key={`${i}-${j}`}
                style={{
                    width: squareSize,
                    height: squareSize,
                    backgroundColor: 'lightblue'
                }}
            />
            );
        }
    }
   
    return (
        <div style={{ position: 'relative', height: '90vh', width: '90vw', overflow: 'hidden'}}>
            <motion.div
                className='absolute top-1/2 left-1/2'
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
    )
}