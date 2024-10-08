import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "НЕ удалось зарегистрироваться",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const { sortBy } = req.query;

    let posts

    if(sortBy==='topPosts'){
      posts=await PostModel.find().sort({viewsNumber:-1}).limit(3).populate("user").exec()
    }
    else{
      posts=await PostModel.find().populate("user").exec(); // связь
    }

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить все статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; // :id

    const article = await PostModel.findById(postId).populate("user");

    if (!article) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    article.viewsNumber += 1;

    await article.save();

    res.json(article);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить все статьи",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const deletedPost = await PostModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({
        message: "Статья с указанным ID не найдена",
      });
    }

    res.status(200).json({
      message: "Статья успешно удалена",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatePost = await PostModel.findById(postId);

    if (!updatePost) {
      return res.status(404).json({
        message: "Не удалось обновить статью",
      });
    }

    updatePost.title = req.body.title;
    updatePost.text = req.body.text;
    updatePost.tags = req.body.tags;
    updatePost.imageUrl = req.body.imageUrl;
    updatePost.user = req.userId;

    await updatePost.save();

    res.status(200).json({
      message: "Статья обновлена",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статью..",
    });
  }
};

export const getFiveTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5);

    const tags = posts
      .map((el) => el.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить теги",
    });
  }
};
