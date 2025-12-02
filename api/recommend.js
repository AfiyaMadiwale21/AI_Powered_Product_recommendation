export default async function handler(req, res) {
    try {
        const { preference, products } = req.body;

        if (!preference) {
            return res.status(400).json({ error: "Preference is required" });
        }

        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

        const prompt = `
You are a product recommendation AI.
Here are the available products:
${products.map((p) => `${p.name} - ₹${p.price}`).join("\n")}
User preference: "${preference}"
From the list, recommend 2–3 product NAMES only.
`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 100,
            }),
        });

        const data = await response.json();

        // FIX: Return format React expects
        return res.status(200).json({
            choices: [
                {
                    message: {
                        content: data?.choices?.[0]?.message?.content || ""
                    }
                }
            ]
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
