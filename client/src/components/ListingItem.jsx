import { Link } from "react-router-dom";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow:md hover:shadow-xl transition-shadow
    overflow-hidden rounded-lg" >
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt='listing cover' 
            className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105
            transition-scale duration-300" />
            <div className="p-3">
                <p className="text-lg font-semibold text-slate-700 truncate">{listing.name}</p>
            </div>
        </Link>
    </div>
  )
}
