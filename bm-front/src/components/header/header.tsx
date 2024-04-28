'use client'

export default function Header() {
    return (
        <header>
            <div className="container flex justify-between items-center">
                <a href="/" className="text-primary-foreground font-bold text-xl">Game</a>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="/user" className="text-primary-foreground">User</a></li>
                        <li><a href="/game" className="text-primary-foreground">Game</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}