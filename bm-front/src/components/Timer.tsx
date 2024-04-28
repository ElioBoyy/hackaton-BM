import { useState, useEffect } from 'react';

interface TimerProps {
    created_at: string
    grid_duration: number
}

interface TimeLeft {
    hours: number
    minutes: number
    seconds: number
}

export default function Timer({ created_at, grid_duration }: TimerProps ) {
    const calculateTimeLeft = () => {
        const now = new Date()
        const createdAt = new Date(created_at)
        const duration = grid_duration * 60 * 60 * 1000
        const difference = createdAt.getTime() + duration - now.getTime()
        
        let timeLeft = {} as TimeLeft

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            }
        }

        return timeLeft
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearTimeout(timer)
    })

    return (
        <span className="text-gray-500 dark:text-gray-400">
            {timeLeft.hours ? `${timeLeft.hours}h ` : ''}
            {timeLeft.minutes ? `${timeLeft.minutes}m ` : (timeLeft.hours) ? '0m ' : ''}
            {timeLeft.seconds ? `${timeLeft.seconds}s remaining` : (timeLeft.hours || timeLeft.minutes) ? '0s remaining' : ''}
            {!timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds ? 'Time\'s up!' : ''} 
        </span>
    )
}