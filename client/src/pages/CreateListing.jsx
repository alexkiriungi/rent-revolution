import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

export default function CreateListing() {
    const [ files, setFiles ] = useState([]);
    const [ formData, setFormData ] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [ imageUploadError, setImageUploadError ] = useState(false);
    const [ uploading, setUploading ] = useState(false);

    const handleFilesSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i=0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                setImageUploadError(false);
                setUploading(false);
            }).catch((error) => {
                setImageUploadError('Error...(each image should be less than 2MB)');
                setUploading(false);
            })
        } else {
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };

    {/* storing the download URLs inside the promise individually */}
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred/ snapshot.totalBytes) * 100;
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-bold text-center my-7'>
                Create a Listing
            </h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text' placeholder='Name' className='border p-3 
                    rounded-lg' id='name' maxLength='62' minLength='10' required />
                    <textarea type='text' placeholder='Description' className='border p-3 
                    rounded-lg' id='description' required />
                    <input type='text' placeholder='Address' className='border p-3 
                    rounded-lg' id='address' maxLength='62' minLength='10' required />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type='checkbox' id='sale' className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type='checkbox' id='rent' className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type='checkbox' id='parking' className='w-5' />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type='checkbox' id='furnished' className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type='checkbox' id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex gap-2 items-center">
                            <input type='number' id='bedrooms' min='1' max='10' required 
                            className='p-3 border border-gray-300 rounded-lg'/>
                            <span>Beds</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <input type='number' id='bathrooms' min='1' max='10' required 
                            className='p-3 border border-gray-300 rounded-lg'/>
                            <span>Baths</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <input type='number' id='regularPrice' min='7000' max='45000' required 
                            className='p-3 border border-gray-300 rounded-lg'/>
                            <div className="flex flex-col items-center">
                                <span>Regular Price</span>
                                <p className='text-xs'>(ksh / month)</p>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <input type='number' id='discountPrice' min='1' max='10' required 
                            className='p-3 border border-gray-300 rounded-lg'/>
                            <div className="flex flex-col items-center">
                                <span>Discounted Price</span>
                                <p className='text-xs'>(ksh / month)</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className='font:semibold'>
                        Images:
                        <span className='font-normal text-gray-600 ml-2 italic'>The first image will be the cover (max 6)</span>
                    </p>
                    <div className="flex gap-4">
                        <input type='file' id='images' accept='image/*' multiple
                        className='p-3 border border-gray-300 rounded w-full border-dashed'
                        onChange={(e)=>setFiles(e.target.files)} />
                        <button disabled={uploading} type="button" className='p-3 text-green-700 border border-green-700 rounded uppercase hover:bg-green-700
                        disabled:opacity-80 hover:text-white transition-all 0.5s' 
                        onClick={handleFilesSubmit} >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className="text-red-700">
                    {imageUploadError && imageUploadError}
                    </p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className="flex justify-between p-3 border items-center">
                                <img src={url} alt="Image listing" className="w-20 h-20 object-contain rounded-lg" />
                                <button type="button" className="p-3 text-red-700 uppercase rounded-lg hover:opacity-80"
                                onClick={() => handleRemoveImage(index)}>
                                    Delete
                                </button>
                            </div>
                        ))
                    }
                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95
                    disabled:opacity-80'>
                        Create Listing
                    </button>
                </div>
                
            </form>
        </main>
    );
}
