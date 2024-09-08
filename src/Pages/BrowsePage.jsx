import SkeletonCard from '../components/SkeletonCard.jsx'

export default function BrowsePage() {


  return (
    <div className="min-h-[90vh] px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full gap-3 mx-auto">
      <SkeletonCard />
    </div>
  );
}
