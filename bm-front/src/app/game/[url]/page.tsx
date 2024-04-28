

export default function GameUrl({ params }: {
    params: {
        url: string
    }
}) {
    return (
        <h1>Url: {params.url}</h1>
    )
}