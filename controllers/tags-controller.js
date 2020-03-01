const { Tag, validateTag } = require("../models/tag");

getAllTags = async (req, res) => {
  try {
    await Tag.find({}, (err, tags) => {
      if (err) return res.status(400).send({ err });
      if (tags.length == 0)
        return res.status(404).send({ err: "No Tags found" });
      return res.status(200).send({ tags });
    });
  } catch (err) {
    return res.status(500).send({ err });
  }
};

createTag = async (req, res) => {
  const { error } = validateTag(req.body);
  if (error) return res.status(400).send({ err: error.details[0].message });

  const exists = await Tag.findOne({ name: req.body.name })

  if (exists) {
    return res.status(403).send({ err: "Tag already exists!" });
  }

  const tag = new Tag({
    name: req.body.name
  });

  try {
    await tag.save();
    return res.status(201).send({
      tag,
      message: "Tag successfully created!"
    });
  } catch (err) {
    return res.status(500).send({ err });
  }
};

module.exports = {
  getAllTags,
  createTag
};
