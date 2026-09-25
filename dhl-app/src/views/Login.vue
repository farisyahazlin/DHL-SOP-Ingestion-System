<template>
  <div class="login-container">
    <div class="login-card">
      <div class="logo-container">
        <img src="../assets/images.png" alt="DHL Logo" class="dhl-logo" />
      </div>
      <h2>Operational Login</h2>
      <p class="subtitle">Knowledge Base System Portal</p>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label>Username</label>
          <input 
            type="text" 
            v-model="username" 
            placeholder="Enter your operational ID" 
            required 
          />
        </div>

        <div class="input-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="Enter password" 
            required 
          />
        </div>

        <button type="submit" class="btn-login">Sign In</button>
      </form>
      
      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        this.errorMessage = '';
        
        // Hits our corrected backend endpoint with the /api prefix
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          username: this.username,
          password: this.password
        });

        // Verify the response payload has the signed JWT token
        if (response.data && response.data.token) {
          // Explicitly save the token into LocalStorage using lowercase 'token'
          localStorage.setItem('token', response.data.token);
          
          // Clear any historical console tracking flags and push to dashboard
          console.log('Authentication successful. Routing to operations workspace...');
          this.$router.push('/dashboard');
        } else {
          this.errorMessage = 'Invalid validation footprint from server.';
        }
      } catch (error) {
        console.error('Login action execution failure:', error);
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message || 'Authentication rejected.';
        } else {
          this.errorMessage = 'Network timeout. Ensure backend core is running.';
        }
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #FFCC00; /* DHL Official Yellow */
  font-family: 'Arial', sans-serif;
}
.login-card {
  background: #ffffff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
}
.dhl-logo {
  max-width: 180px;
  margin-bottom: 20px;
}
h2 {
  margin: 0 0 5px 0;
  color: #D40511; /* DHL Official Red */
  font-weight: bold;
}
.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
}
.input-group {
  text-align: left;
  margin-bottom: 20px;
}
label {
  display: block;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}
input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
}
input:focus {
  outline: none;
  border-color: #D40511;
}
.btn-login {
  width: 100%;
  padding: 12px;
  background-color: #D40511;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-login:hover {
  background-color: #b3040e;
}
.error-text {
  color: #D40511;
  font-size: 14px;
  margin-top: 15px;
  font-weight: bold;
}
</style>