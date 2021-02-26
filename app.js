const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const itemSchema = new mongoose.Schema({
  name: String,
});
const Item = new mongoose.model("Item", itemSchema);

app.get("/", function (req, res) {
  Item.find((err, items) => {
    if (err) {
      console.log(err);
    } else {
      res.render("list", { title: "Home", newListItems: items });
    }
  });
});
app.post("/", function (req, res) {
  const item = req.body.newItem;
  const newItem = new Item({
    name: item,
  });
  newItem.save();
  res.redirect("/");
});
app.post("/delete", (req, res) => {
  let deleteItem = req.body.checkbox;

  Item.deleteOne({ _id: deleteItem }, (err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});
const listSchema = {
  name: "string",
  items: [itemSchema],
};
const List = mongoose.model("List", listSchema);

app.get("/:customListName", (req, res) => {
  const customList = req.params.customListName;
  List.findOne({ name: customList }, (err, foundList) => {
    if (err) {
      console.log(err);
    } else {
      if (!foundList) {
        const list = new List({
          name: customList,
          items: [],
        });
        list.save();
        console.log("List not found");
        // res.render("list"  foundList.name + "", {
        //   newListItems: foundList.items,
        // });
      } else {
        console.log("List found");
        res.render("list", { newListItems: foundList.items });
      }
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
