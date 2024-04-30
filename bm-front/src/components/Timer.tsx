import { axiosQuery } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';

interface TimerProps {
    created_at: string
    grid_duration: number
    grid_id: number
    classProps: string
}

interface TimeLeft {
    hours: number
    minutes: number
    seconds: number
}

export default function Timer({ created_at, grid_duration, grid_id, classProps }: TimerProps, ) {
    const calculateTimeLeft = useCallback(() => {
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
            };
        }

        return timeLeft;
    }, [created_at, grid_duration])

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())



    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)
        return () => clearInterval(timer)
    }, [calculateTimeLeft])

    useEffect(() => {
        if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
            const response = axiosQuery(`/api/grids/${grid_id}/status`, 'PUT', null, localStorage.getItem('jwtToken'))
            if (!response) {
                console.error('Error while updating grid status')
            }
        }
    }, [calculateTimeLeft, grid_id, timeLeft.hours, timeLeft.minutes, timeLeft.seconds])



    return (
        <span className={!classProps || classProps === '' ? "text-gray-500 dark:text-gray-400" : classProps}>
            {timeLeft.hours ? `${timeLeft.hours}h ` : ''}
            {timeLeft.minutes ? `${timeLeft.minutes}m ` : (timeLeft.hours) ? '0m ' : ''}
            {timeLeft.seconds ? `${timeLeft.seconds}s remaining` : (timeLeft.hours || timeLeft.minutes) ? '0s remaining' : ''}
            {!timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds ? 'Time\'s up!' : ''} 
        </span>
    );
}