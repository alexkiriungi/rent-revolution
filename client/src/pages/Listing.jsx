import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {
    SwiperCore.use( [Navigation] );
    const [ listing, setListing ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);
    const params = useParams();
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/getlisting/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);
  return (
    <main>
        {loading && <p className="text-center my-7 text-2xl">Loading... Please wait!</p>}
        {error && (
            <div className="flex flex-col justify-center">
                <p className="text-center my-7 text-2xl">Oops! Something went wrong...</p>
                <Link to={``} className="text-blue-700 text-center hover:underline">Go back</Link>
            </div>
        )}
        {listing && !loading && !error && (
            <>
                <Swiper navigation>
                    {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div className="h-[550px]" 
                            style={{background: `url(${url}) center no-repeat`,
                            backgroundSize: 'cover'}}></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        )}
    </main>
  );
}
