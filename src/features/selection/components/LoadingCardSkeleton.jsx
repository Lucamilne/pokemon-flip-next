export default function LoadingCardSkeleton({ index }) {
    return <div className="fade-in-out aspect-square bg-pokedex-inner-blue/15 rounded-md" style={{ animationDelay: `${index * 50}ms`, opacity: 0 }} />;
}
