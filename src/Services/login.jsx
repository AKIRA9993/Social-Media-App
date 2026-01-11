import axios from 'axios';

export async function sendLoginData(values) {
  try {
    console.log('Login attempt with:', values);
    
    const response = await fetch('https://linked-posts.routemisr.com/users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })

    const data = await response.json()
    console.log('Login response:', response.status, data);

    if (!response.ok) {
      return { error: data.message || 'Login failed' }
    }

    return { data }
  } catch (error) {
    console.log('Login error:', error);
    return { error: 'Network error. Please try again.' }
  }
}
// getting user logged in data
export async function getLoggedUserData() {
  try{
    const {data } = await axios.get('https://linked-posts.routemisr.com/users/profile-data',{
      headers:{
        token: localStorage.getItem('token')
      }
    })
    console.log(data);
    return data ;

  }catch(err){
    console.log(err);
    return err.response.data;
  }
}