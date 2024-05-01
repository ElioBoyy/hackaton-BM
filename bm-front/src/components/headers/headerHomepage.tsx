import { Divider } from "@nextui-org/divider"
import { Button } from "../ui/button"
import { Label } from "@radix-ui/react-label"
import { useEffect, useState } from "react"


export default function HeaderHomepage() {
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('jwtToken')
        setToken(token)
    } , [])


    return (
        <header className='absolute w-full z-50 bg-background'>
            <div className='flex h-[73px] items-center justify-between py-4 px-6'>
                <div className='flex items-center gap-5'>
                    <h1 className="text-2xl font-bold cursor-pointer" onClick={(e:any) => window.location.href = '/'}>My-r/Place.bm</h1>
                    <Button className="cursor-pointer" variant='secondary' onClick={(e:any) => window.location.href = '/game_dashboard'}>Play the game</Button>
                </div>
                <div>
                    <Button className='cursor-pointer' size="sm" variant="secondary" onClick={(e:any) => {window.location.href = '/user'}} >
                        {token ? 'User' : 'Sign in'}
                    </Button>
                </div>
            </div>
            <Divider />  
        </header>
    )
}