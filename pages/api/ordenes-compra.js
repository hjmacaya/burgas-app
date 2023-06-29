import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get("https://lagarto6.ing.puc.cl/ordenes-compra");
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving data from the API" });
  }
}
