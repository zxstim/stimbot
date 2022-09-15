import axios from 'axios';

// insert your domain
export default axios.create({
    baseURL: 'https://yourdomain.com/'
});