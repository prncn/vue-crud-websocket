const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

router.get("/", async (request, response) => {
  const users = await loadDataBase();
  response.send(await users.find().toArray());
});

router.get("/:userIP", async (request, response) => {
  const users = await loadDataBase();
  if (response) {
    response.send(await users.findOne({ userIP: request.params.userIP }));
  } else {
    console.log("User not found.");
    return false;
  }
});

router.post("/", async (request, response) => {
  const users = await loadDataBase();
  await users.insertOne({
    userIP: request.body.userIP,
    icon: Math.floor(Math.random() * 6),
    created_posts: [],
    liked_posts: [],
    joined_at: new Date(),
  });
  response.status(201).send();
});

router.get("/:userIP/posts", async (request, response) => {
  const users = await loadDataBase();
  const user = await users.findOne({ userIP: request.params.userIP });
  console.log(user);
  const type = request.query.type;
  if (!type) {
    console.log("Invalid type in user posts query.");
    response.status(400).send();
    return false;
  }
  if (type === "created") {
  }

  response.send(await users.find().toArray());
  response.status(200).send();
});

router.put("/:userIP/posts", async (request, response) => {
  const users = await loadDataBase();
  if (request.body.created_post) {
    await users.updateOne(
      { userIP: request.params.userIP },
      { $push: { created_posts: request.body.created_post } }
    );
  }
  if (request.body.liked_post) {
    await users.updateOne(
      { userIP: request.params.userIP },
      { $push: { liked_posts: request.body.liked_post } }
    );
  }
  response.status(200).send();
});

router.delete("/:userIP/posts", async (request, response) => {
  const users = await loadDataBase();
  if (request.body.created_post) {
    await users.updateOne(
      { userIP: request.params.userIP },
      { $pull: { created_posts: request.body.created_post } }
    );
  }
  if (request.body.liked_post) {
    await users.updateOne(
      { userIP: request.params.userIP },
      { $pull: { liked_posts: request.body.liked_post } }
    );
  }
  response.status(200).send();
});

router.delete("/:id", async (request, response) => {
  const users = await loadDataBase();
  await users.deleteOne({ _id: new mongodb.ObjectID(request.params.id) });
  response.status(200).send();
});

async function loadDataBase() {
	try {
		const uri = process.env.MONGODB;
		const client = await mongodb.MongoClient.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const collection = client.db("vue-websocket").collection("users");
		return collection;
	} catch (error) {
		console.log(error);
	}
}

module.exports = router;
