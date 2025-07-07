import axios from 'axios';

 const fetchSocietyById = async (id) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/society/${id}`);
    console.log("Fetched society:", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching society:", err);
    throw err;
  }
};

export default fetchSocietyById;