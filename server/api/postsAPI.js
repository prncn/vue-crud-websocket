require("dotenv").config();
const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

router.get("", async (request, response) => {
  let posts = await loadDataBase();
  // const size = await posts.countDocuments();
  // posts.updateMany({}, { $set: {replies: []} })

  const limit = parseInt(request.query.limit);
  const offset = parseInt(request.query.offset);
  posts = posts.find({ type: "status" }).sort({ created_at: 1 });
  if (limit) {
	posts = posts.limit(limit);
  }
  if (offset) {
	posts = posts.skip(offset);
  }

  response.send(await posts.toArray());
});

router.get("/:id", async (request, response) => {
  const posts = await loadDataBase();
  let result;
  if (request.query.type === "status") {
	result = await posts.findOne({
	  $and: [
		{ type: "status" },
		{ _id: new mongodb.ObjectID(request.params.id) },
	  ],
	});
  } else if (request.query.type === "reply") {
	result = await posts.findOne({
	  $and: [
		{ type: "reply" },
		{ _id: new mongodb.ObjectID(request.params.id) },
	  ],
	});
  } else {
	result = await posts.findOne({
	  _id: new mongodb.ObjectID(request.params.id),
	});
  }
  response.send(result);
});

router.post("/", async (request, response) => {
  const posts = await loadDataBase();
  const sendingPost = await posts.insertOne({
	type: request.body.type,
	content: request.body.content,
	userIP: request.body.userIP,
	likes: 0,
	replies: [],
	created_at: new Date(),
  });

  const sentPost = await sendingPost.ops[0];

  response.send(sentPost);
  response.status(201).send();
});

router.put("/:id/reply", async (request, response) => {
  const posts = await loadDataBase();
  await posts.updateOne(
	{ _id: new mongodb.ObjectID(request.params.id) },
	{ $push: { replies: request.body.replyId } }
  );
  await posts.updateOne(
	{ _id: new mongodb.ObjectID(request.body.replyId) },
	{ $set: { parent: request.params.id } }
  );

  response.status(200).send();
});

router.delete("/:id/reply", async (request, response) => {
  const posts = await loadDataBase();
  await posts.updateOne(
	{ _id: new mongodb.ObjectID(request.params.id) },
	{ $pull: { replies: request.body.replyId } }
  );

  response.status(200).send();
});

router.patch("/:id/like", async (request, response) => {
  const posts = await loadDataBase();
  await posts.updateOne(
	{ _id: new mongodb.ObjectID(request.params.id) },
	{
	  $inc: { likes: 1 },
	}
  );
  response.status(200).send();
});

router.patch("/:id/unlike", async (request, response) => {
  const posts = await loadDataBase();
  await posts.updateOne(
	{ _id: new mongodb.ObjectID(request.params.id) },
	{
	  $inc: { likes: -1 },
	}
  );
  response.status(200).send();
});

router.delete("/:id", async (request, response) => {
  const posts = await loadDataBase();
  await posts.deleteOne({ _id: new mongodb.ObjectID(request.params.id) });
  response.status(200).send();
});
	
async function loadDataBase() {
  try {
	const uri = process.env.MONGODB;
	const client = await mongodb.MongoClient.connect(uri, {
	  useNewUrlParser: true,
	  useUnifiedTopology: true,
	});
	const collection = client.db("vue-websocket").collection("posts");
	return collection;
  } catch (error) {
	console.log(error);
  }
}

module.exports = router;
