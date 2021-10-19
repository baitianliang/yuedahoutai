import axios from 'axios'

let instance = axios.create({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': ''
      // 'Authorization': 'Bearer 20bb9171-e1ff-4443-881b-52d3c82eeb03'
    }
})

export default instance