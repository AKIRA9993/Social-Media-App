import axios from "axios";

export async function sendRegisterData(values) {
  try {
    console.log('Sending registration data:', values);
    console.log('Date type:', typeof values.dateOfBirth, values.dateOfBirth);
    
    const { data } = await axios.post(
      `https://linked-posts.routemisr.com/users/signup`,
      values,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(data);
    return { success: true, data };
  } catch (err) {
    console.log('Registration error:', err);
    console.log('Error response:', err.response?.data);
    // Handle case where err.response might be undefined
    const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
    return { error: errorMessage };
  }
}