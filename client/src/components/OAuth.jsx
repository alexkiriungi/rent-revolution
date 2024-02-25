import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';


export default function OAuth() {
    const dispatch = useDispatch();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const resultsFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ name: resultsFromGoogle.user.displayName, 
                    email: resultsFromGoogle.user.email, photo: resultsFromGoogle.user.photoURL }),
            })
            const data = await res.json();
            console.log(data);
            dispatch(signInSuccess(data));
        } catch (error) {
            console.log('Could not sign in with google', error);
        }
    };

  return (
    <button type='button' className='bg-red-700 text-white p-3 rounded-lg
    uppercase hover:opacity-95' onClick={handleGoogleClick}>
        Continue with google
    </button>
  );
}
