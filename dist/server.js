import express from "express";
const app = express();
const port = 10103;
app.use(express.static("public"));
app.listen(port, () => {
    console.log(`Logo server open on ${port}`);
});
