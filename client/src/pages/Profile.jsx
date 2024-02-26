import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from "../firebase";
import { updateUserStart,
  updateUserSuccess, 
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure } from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [ file, setFile ] = useState(undefined);
  const [ imageUpload, setImageUpload ] = useState(0);
  const [ fileUploadError, setFileUploadError ] = useState(false);
  const [ formData, setFormData ] = useState({});
  const [ updateSuccess, setUpdateSuccess ] = useState(false);

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

  const handleChange = (e) => {
    setUpdateSuccess(false);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleUserDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.sucess === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-bold text-center my-7'>
        Profile
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
        className="border p-3 rounded-lg" defaultValue={currentUser.username} 
        onChange={handleChange} />
        <input type='email' placeholder="email" id="email"
        className="border p-3 rounded-lg" defaultValue={currentUser.email} 
        onChange={handleChange} />
        <input type='password' placeholder="********" id="password"
        className="border p-3 rounded-lg" 
        onChange={handleChange} />
        <button  className="bg-slate-700 text-white rounded-lg
        p-3 uppercase hover:opacity-95 disabled:opacity-80" disabled={loading} >
          {loading? 'Loading...': 'Update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleUserDelete} className="text-red-700 cursor-pointer hover:underline">
          Delete account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer hover:underline">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5"> 
        {error ? error: ''}
      </p>
      <p className="text-green-700 mt-5"> 
        {updateSuccess ? 'User updated successfully!': ''}
      </p>
    </div>
  );
}
