import { axiosQuery } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";

interface GameCreatorLabelProps {
    user_id: number
}

export default function GameCreatorLabel( owner : GameCreatorLabelProps) {
    const [username, setUsername] = useState('');

    const getGridOwner = async (userId : number) => {
        const response = await axiosQuery('/api/grids/user/' + userId, 'GET', null, null)
        if (response?.data) {
            setUsername(response?.data)
        } else {
            console.error('Error while fetching')
        }
    }

    useEffect(() => {
        getGridOwner(owner.user_id)
    }, [])

    return (
        <Label>Owner: {username}</Label>
    )
}