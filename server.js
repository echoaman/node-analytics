require("dotenv").config();
const { Client } = require('@notionhq/client');
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const notion = new Client({ auth: process.env.NOTION_AUTH });

async function postEvent({ evt, lab, dev }) {
    return await notion.pages.create({
        parent : { database_id : process.env.NOTION_DB },
        properties : {
            "title" : {
                title: [
                    {
                        type : "text",
                        text : {  "content": evt }
                    }
                ]
            },
            "JW%3Fu" : {
                "rich_text" : [
                    {
                        type : "text",
                        text : { content : lab }
                    }
                ]
            },
            "n%5D_R" : {
                "rich_text" : [
                    {
                        type : "text",
                        text : { content : dev }
                    }
                ]
            },
            "%5C%5EPq" : {
                date : {
                    start : new Date().toISOString()
                }
            }
        }
    });
}

app.post("/event", async (req, res) => {
    if(req.body.length == 0) {
        res.status(400).send("Request body is not set");
        return;
    }

    const { evt, lab, dev } = req.body;
    if(!evt || !lab || !dev) {
        res.status(400).send("Request body's key(s) are not set");
        return;
    }

    try {
        await postEvent({ evt, lab, dev });
        res.sendStatus(201);    
    } catch (err) {
        res.status(500).send(err.body);
    }
});

app.get("/", function(req, res) {
    res.send("hi");
});

app.listen(PORT);