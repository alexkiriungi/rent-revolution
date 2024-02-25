import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [ formData, setFormData ] = useState({});
  const [ error, setError ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ success, setSuccess ] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setError(null);
    setSuccess(null);
    setLoading(false);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success == false) {
        setError(data.message);
        setLoading(false);
        setSuccess(null);
        return;
      }
      setLoading(false);
      setError(null);
      setSuccess('User Signed in successfully!');
      navigate('/');
    } catch (error) {
      setLoading(false);
      setSuccess(null);
      setError(error.message);
    }
    
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-bold my-7'>
        Sign In
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='email' placeholder='name@example.com'
        className='border p-3 rounded-lg' id='email' onChange={handleChange} />
        <input type='password' placeholder='********'
        className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 
        rounded-lg uppercase hover:opacity-95 disabled:opacity-80' type='submit' >
          {loading ? 'Loading...': 'Sign In'}
        </button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700 hover:underline'>Sign up</span>
        </Link>
      </div>
      { error && <p className='text-red-500 mt-5'>{error}</p>}
      { success && <p className='text-green-600 mt-5'>{success}</p>}
    </div>
  );
}
