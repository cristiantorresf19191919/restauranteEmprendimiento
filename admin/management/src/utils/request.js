import axios from 'axios';

const url = process.env.VUE_APP_URL;
const header = {
  Accept: 'application/json',
};

export async function register(user) {
  try {
    const res = await axios.post(`${url}/auth/register`, { ...user }, header);
    return res;
  } catch (error) {
    console.log('🚀 ~ file: request.js ~ line 15 ~ register ~ error', error);
    return error;
  }
}

export async function updateRequest(domain, id, user) {
  try {
    const res = await axios.put(`${url}/${domain}/${id}`, { ...user }, header);
    return res;
  } catch (error) {
    console.log('🚀 ~ file: request.js ~ line 15 ~ register ~ error', error);
    return error;
  }
}

export async function fetchAll(domain) {
  try {
    const res = await axios.get(`${url}/${domain}`,header);
    console.log("🚀 ~ file: request.js ~ line 21 ~ fetchAll ~ res", res)
    return res
  } catch (error) {
      console.log("🚀 ~ file: request.js ~ line 23 ~ fetchAll ~ error", error)
      return error;
  }
}

export async function fetchById(domain, id){
  try {
    const res = await axios.get(`${url}/${domain}/${id}`,header);
    console.log("🚀 ~ file: request.js ~ line 21 ~ fetchAll ~ res", res)
    return res
  } catch (error) {
      console.log("🚀 ~ file: request.js ~ line 23 ~ fetchAll ~ error", error)
      return error;
  }

}

export async function deleteById(domain,id){
  try {
    const res = await axios.delete(`${url}/${domain}/${id}`, header );
    return res;
  } catch (error) {
    console.log(error);
  }
}
