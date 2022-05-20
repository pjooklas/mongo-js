import { createInterface } from "readline";
import { MongoClient, ObjectId } from "mongodb";

const rl = createInterface(process.stdin, process.stdout);

function input(message) {
    return new Promise((reslove, reject) => {
        rl.question(message, (ans) => {
            reslove(ans);
        });
    });
}

const client = new MongoClient("mongodb://localhost:27017");

await client.connect();

const db = client.db("zmones");

let choice;

do {
    console.log("1. visi zmones");
    console.log("2. naujas zmogus");
    console.log("3. istrinti zmogu");
    console.log("0. baigti");
    choice = await input("pasirink: ");
    switch (choice) {
        case "1":
            {
                const docs = await db
                    .collection("zmones")
                    .find({})
                    .toArray();

                console.log(JSON.stringify(docs, null, 2));
                break;
            }
        case "2":
            {
                const vardas = await input("Ivesk varda: ");
                const pavarde = await input("Ivesk pavarde: ");
                await db.collection("zmones").insertOne({
                    vardas,
                    pavarde
                });
                break;
            }
        case "3":
            {
                const _id = await input("Ivesk id: ");
                await db.collection("zmones").deleteOne({
                    _id: ObjectId(_id)
                });
                break;
            }
    }
} while (choice !== "0");

await client.close();

rl.close();