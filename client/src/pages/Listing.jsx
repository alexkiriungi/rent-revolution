import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Listing() {
    const params = useParams();
    useEffect(() => {
        const fetchListing = async () => {
            const res = await fetch(`/api/listing/getlisting/${params.listingId}`);
            const data = await res.json();
        }
        fetchListing();
    })
  return (
    <div>Listing</div>
  )
}
