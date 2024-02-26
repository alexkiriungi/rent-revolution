import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from "../firebase";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [ file, setFile ] = useState(undefined);
  const [ imageUpload, setImageUpload ] = useState(0);
  const [ fileUploadError, setFileUploadError ] = useState(false);
  const [ formData, setFormData ] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = ( snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUpload(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
          setFormData({...formData, avatar: downloadURL })
        );
      }
    );
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-bold text-center my-7'>
        Profile
      </h1>
      <form className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept='image/*' 
        onChange={(e)=>setFile(e.target.files[0])} />
        <img onClick={()=>fileRef.current.click()} 
        src={formData.avatar || currentUser.avatar} alt='profile' 
        className="rounded-full h-24 w-24 object-cover 
        cursor-pointer self-center mt-2 hover:animate-bounce" />
        <p className="text-sm self-center">
        {fileUploadError ? 
          (<span className="text-red-700">Error uploading image...(image must be at most 2MB)</span>) :
          imageUpload > 0 && imageUpload < 100 ? (
            <span className="text-slate-700">
              {`Uploading ${imageUpload}%`}
            </span>) :
            imageUpload === 100 ? (
              <span className="text-green-700">Upload successful!</span>
            ) : ("")
          }
          </p>
        <input type='text' placeholder="username" id="username"
        className="border p-3 rounded-lg" />
        <input type='email' placeholder="email" id="email"
        className="border p-3 rounded-lg" />
        <input type='password' placeholder="********" id="password"
        className="border p-3 rounded-lg" />
        <button  className="bg-slate-700 text-white rounded-lg
        p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}
