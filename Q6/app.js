const express = require("express");
const app = express();
const PORT = 8000;
app.use(express.static("public"))
app.get("/api/joke", async (req, res) => {
    try {
        const response = await fetch("https://official-joke-api.appspot.com/random_joke");
        if (!response.ok) {
            return res.status(502).json({
                error: "unable to fetch the joke"
            });
        }
        const joke = await response.json();
        res.json(joke);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Something went Wrong"
        });
    }

})
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})