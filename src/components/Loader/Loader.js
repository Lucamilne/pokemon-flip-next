export default function Loader() {
    return (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 animate-ping rounded-full bg-theme-red opacity-75"></div>
            <div className="pokeball-loader relative z-10" />
        </span>
    )
}