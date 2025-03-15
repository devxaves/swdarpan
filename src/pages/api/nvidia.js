// pages/api/nvidia.js
export default async function handler(req, res) {
    const API_KEY = "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";
    const invokeUrl = "https://health.api.nvidia.com/v1/biology/nvidia/molmim/generate";
  
    try {
        const response = await fetch(invokeUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });
  
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error proxying request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }