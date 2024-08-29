require("dotenv").config();
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseManagerId = process.env.NOTION_DATABASE_MANAGER_ID


//получить id менеджера по его TelegramID
async function getManagerChatId(id) {
    try {
        const response = await notion.databases.query({
            database_id: databaseManagerId, 
            "filter": {
                "property": "ID",
                "rich_text": {
                    "contains": id
                }
            }
        });

        return response.results[0]?.id; 
        
    } catch (error) {
        console.error(error.message)
    }
}




class ManagerController {

    async managersChatId(req, res) {
        const id = req.params.id; // получаем id
        const manager = await getManagerChatId(id);
        if(manager){
            res.json(manager);
        }
        else{
            res.json({});
        }
    }

}


module.exports = new ManagerController()