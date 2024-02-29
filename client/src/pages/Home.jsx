import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  SwiperCore.use( [Navigation] );
  const [ offerListings, setOfferListings ] = useState([]);
  const [ saleListings, setSaleListings ] = useState([]);
  const [ rentListings, setRentListings ] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error.message)
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top section */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Unlocking your <span className='text-slate-500'>affordable</span> 
          <br />
          home starts here
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
        Welcome to Rent Rev, where your available home 
        is just a click away! We are thrilled to introduce a 
        revolutionary real estate platform designed with you in mind.
        <br />
        Whether you're on the hunt for your first apartment, searching 
        for a family home, or exploring investment opportunities, 
        Rent Rev is your gateway to a seamless and personalized real estate 
        experience.
        </div>
        <Link to={'/search'} className='text-xs sm:text-sm text-blue-700
        hover:underline'>
          Let's hunt...
        </Link>
      </div>

      {/* Swiper images */}
      <Swiper navigation>
        {
          offerListings && offerListings.length > 0 && 
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
              style={{background: `url(${listing.imageUrls[0]}) center no-repeat`,
            backgroundSize: 'cover'}}
              className='h-[500px]'
              key={listing._id}
              ></div>
            </SwiperSlide>
          ))
        }
      </Swiper>
      {/* Listing results */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
                <Link to={'/search?offer=true'} className='text-sm text-blue-800 hover:underline'>
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  offerListings.map((listing) => (
                    < ListingItem key={listing._id} listing={listing} />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Places for Rent</h2>
                <Link to={'/search?type=rent'} className='text-sm text-blue-800 hover:underline'>
                  Show more places for rent
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  rentListings.map((listing) => (
                    < ListingItem key={listing._id} listing={listing} />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl font-semibold text-slate-600'>Recent Places for Sale</h2>
                <Link to={'/search?type=sale'} className='text-sm text-blue-800 hover:underline'>
                  Show more places for sale
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  saleListings.map((listing) => (
                    < ListingItem key={listing._id} listing={listing} />
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}
