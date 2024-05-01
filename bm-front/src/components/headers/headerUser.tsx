import { Divider } from "@nextui-org/divider"
import { Button } from "../ui/button"


export default function HeaderUser() {

    return (
        <header className='absolute w-full z-50 bg-background'>
            <div className='flex h-[73px] items-center justify-between py-4 px-6'>
                <div className='flex items-center gap-5'>
                    <Button className='cursor-pointer' size="sm" variant="secondary" onClick={(e:any) => {window.location.href = '/'}} >
                        Home page
                    </Button>
                    <h1 className="text-2xl font-bold">User</h1>
                </div>
                <Button className='cursor-pointer' size="sm" onClick={(e:any) => {window.location.href = '/game_dashboard'}} >
                    Game lobbies
                </Button>
            </div>
            <Divider />  
        </header>
    )
}